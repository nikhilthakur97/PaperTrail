import { PDFDocument } from 'pdf-lib';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ImageChunk {
  type: 'image';
  index: number;
  pageNumber: number;
  imageData: string; // base64
  description: string; // AI-generated description
  embedding: number[];
}

export interface TextChunk {
  type: 'text';
  index: number;
  text: string;
  embedding: number[];
}

export type MultimodalChunk = ImageChunk | TextChunk;

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse = (await import('pdf-parse-fork' as any)).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract images from PDF as base64 encoded strings
 */
export async function extractImagesFromPDF(buffer: Buffer): Promise<Array<{ imageData: string; pageNumber: number }>> {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    const images: Array<{ imageData: string; pageNumber: number }> = [];

    const pageCount = pdfDoc.getPageCount();
    console.log(`📊 PDF has ${pageCount} pages`);

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      const page = pdfDoc.getPage(pageIndex);

      // Get all objects on the page
      const pageNode = page.node;
      const resources = pageNode.Resources();

      if (!resources) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xObjects = resources.lookup(pdfDoc.context.obj('XObject')) as any;
      if (!xObjects) continue;

      const xObjectKeys = xObjects.dict.keys();

      for (const key of xObjectKeys) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const xObject = xObjects.lookup(key) as any;
          if (!xObject) continue;

          const subtype = xObject.dict.lookup(pdfDoc.context.obj('Subtype'));
          if (!subtype || subtype.toString() !== '/Image') continue;

          // Get image dimensions
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const width = xObject.dict.lookup(pdfDoc.context.obj('Width')) as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const height = xObject.dict.lookup(pdfDoc.context.obj('Height')) as any;

          // Skip very small images (likely decorative or icons)
          if (width && height &&
              typeof width.numberValue === 'number' &&
              typeof height.numberValue === 'number' &&
              (width.numberValue < 100 || height.numberValue < 100)) {
            continue;
          }

          // Try to extract the image data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const filter = xObject.dict.lookup(pdfDoc.context.obj('Filter')) as any;
          const filterName = filter ? filter.toString() : '';

          // Handle different image formats
          if (filterName.includes('DCTDecode') || filterName.includes('JPXDecode')) {
            // JPEG or JPEG2000
            const imageBytes = xObject.contents;
            const base64Image = Buffer.from(imageBytes).toString('base64');

            images.push({
              imageData: `data:image/jpeg;base64,${base64Image}`,
              pageNumber: pageIndex + 1,
            });
          }
        } catch (err) {
          // Skip this image if we can't extract it
          console.warn(`Could not extract image from page ${pageIndex + 1}:`, err);
          continue;
        }
      }
    }

    console.log(`✓ Extracted ${images.length} images from PDF`);
    return images;
  } catch (error) {
    console.error('Error extracting images from PDF:', error);
    // Don't throw - return empty array if image extraction fails
    return [];
  }
}

/**
 * Analyze an image using Gemini Vision to extract table/chart data
 */
export async function analyzeImageWithGemini(imageData: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Remove data URL prefix to get just the base64 data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analyze this image from a research paper. If it contains:
- A TABLE: Convert it to Markdown table format with proper alignment
- A CHART/GRAPH: Describe the data points, trends, and key findings in detail
- A DIAGRAM: Explain the components and their relationships
- TEXT/EQUATIONS: Extract and format the content

Be comprehensive and structure your response with clear headings. If this is a table, you MUST provide it in Markdown table format.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      },
    ]);

    const response = await result.response;
    const description = response.text();

    console.log('✓ Generated image description');
    return description;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    return 'Error analyzing image content';
  }
}

/**
 * Generate embeddings for text using simple hash-based approach
 * (You can replace this with Azure OpenAI embeddings if available)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Try Azure OpenAI first
    const { AzureOpenAI } = await import('openai');
    const openai = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
      deployment: 'text-embedding-ada-002',
    });

    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text.slice(0, 8000), // Limit to 8000 chars
    });

    return response.data[0].embedding;
  } catch {
    // Fallback to simple hash-based embedding
    const dimension = 384;
    const embedding = new Array(dimension).fill(0);

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const index = (charCode + i) % dimension;
      embedding[index] += charCode / 1000;
    }

    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / (magnitude || 1));
  }
}

/**
 * Split text into chunks for embedding
 */
export function chunkText(text: string, maxWordsPerChunk: number = 500): string[] {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    const wordCount = words.length;

    if (currentWordCount + wordCount > maxWordsPerChunk && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'));
      currentChunk = [paragraph];
      currentWordCount = wordCount;
    } else {
      currentChunk.push(paragraph);
      currentWordCount += wordCount;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }

  return chunks;
}

/**
 * Process PDF with multimodal content extraction
 */
export async function processMultimodalPDF(buffer: Buffer): Promise<MultimodalChunk[]> {
  console.log('🔍 Starting multimodal PDF processing...');

  const chunks: MultimodalChunk[] = [];
  let globalIndex = 0;

  // 1. Extract and process text
  console.log('📄 Extracting text...');
  const text = await extractTextFromPDF(buffer);
  console.log(`✓ Extracted ${text.length} characters`);

  const textChunks = chunkText(text);
  console.log(`✓ Created ${textChunks.length} text chunks`);

  for (const textChunk of textChunks) {
    const embedding = await generateEmbedding(textChunk);
    chunks.push({
      type: 'text',
      index: globalIndex++,
      text: textChunk,
      embedding,
    });
  }

  // 2. Extract and process images (tables, charts, diagrams)
  console.log('🖼️  Extracting images...');
  const images = await extractImagesFromPDF(buffer);

  if (images.length > 0) {
    console.log(`📊 Analyzing ${images.length} images with Gemini Vision...`);

    for (const image of images) {
      // Analyze the image with Gemini Vision
      const description = await analyzeImageWithGemini(image.imageData);

      // Generate embedding for the description
      const embedding = await generateEmbedding(description);

      chunks.push({
        type: 'image',
        index: globalIndex++,
        pageNumber: image.pageNumber,
        imageData: image.imageData,
        description,
        embedding,
      });

      console.log(`✓ Processed image from page ${image.pageNumber}`);
    }
  }

  console.log(`✅ Multimodal processing complete: ${chunks.length} total chunks (${textChunks.length} text, ${images.length} images)`);
  return chunks;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find most relevant chunks (text and images) for a query
 */
export async function findRelevantMultimodalChunks(
  query: string,
  chunks: MultimodalChunk[],
  topK: number = 5
): Promise<MultimodalChunk[]> {
  const queryEmbedding = await generateEmbedding(query);

  const chunksWithScores = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  chunksWithScores.sort((a, b) => b.score - a.score);

  return chunksWithScores.slice(0, topK).map(item => item.chunk);
}
