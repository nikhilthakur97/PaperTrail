import { AzureOpenAI } from 'openai';

// Initialize Azure OpenAI for embeddings (reuse existing credentials)
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
  deployment: 'text-embedding-ada-002', // Standard Azure embedding model
});

export interface Chunk {
  text: string;
  embedding: number[];
  index: number;
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Use pdf-parse-fork which is a working maintained fork
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
 * Split text into chunks for embedding
 * Using a simple approach: split by paragraphs and combine to ~500 words per chunk
 */
export function chunkText(text: string, maxWordsPerChunk: number = 500): string[] {
  // Split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    const wordCount = words.length;

    if (currentWordCount + wordCount > maxWordsPerChunk && currentChunk.length > 0) {
      // Start a new chunk
      chunks.push(currentChunk.join('\n\n'));
      currentChunk = [paragraph];
      currentWordCount = wordCount;
    } else {
      currentChunk.push(paragraph);
      currentWordCount += wordCount;
    }
  }

  // Add the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }

  return chunks;
}

/**
 * Generate embeddings for a text chunk using Azure OpenAI
 * Note: If you don't have text-embedding-ada-002 deployed, this will create a simple hash-based embedding
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Try to use Azure OpenAI embeddings if available
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });
      console.log('✓ Generated Azure OpenAI embedding');
      return response.data[0].embedding;
    } catch {
      // Fallback to simple hash-based embedding for demo purposes
      console.log('→ Azure embeddings not available, using fallback hash-based embeddings');
      return createSimpleEmbedding(text);
    }
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Use fallback
    console.log('→ Using fallback embeddings due to error');
    return createSimpleEmbedding(text);
  }
}

/**
 * Fallback: Create a simple hash-based embedding for demo purposes
 * This creates a 384-dimensional vector based on text content
 */
function createSimpleEmbedding(text: string): number[] {
  const dimension = 384; // Match sentence-transformers dimension
  const embedding = new Array(dimension).fill(0);

  // Simple hash-based approach
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const index = (charCode + i) % dimension;
    embedding[index] += charCode / 1000;
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / (magnitude || 1));
}

/**
 * Process PDF: extract text, chunk it, and generate embeddings
 */
export async function processPDF(buffer: Buffer): Promise<Chunk[]> {
  // Extract text
  console.log('📄 Extracting text from PDF...');
  const text = await extractTextFromPDF(buffer);
  console.log(`✓ Extracted ${text.length} characters`);

  // Chunk the text
  console.log('📦 Chunking text...');
  const textChunks = chunkText(text);
  console.log(`✓ Created ${textChunks.length} chunks`);

  // Generate embeddings for each chunk
  console.log('🧮 Generating embeddings...');
  const chunks: Chunk[] = [];
  for (let i = 0; i < textChunks.length; i++) {
    const embedding = await generateEmbedding(textChunks[i]);
    chunks.push({
      text: textChunks[i],
      embedding,
      index: i,
    });
  }
  console.log(`✓ Generated embeddings for ${chunks.length} chunks`);

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
 * Find most relevant chunks for a query
 */
export async function findRelevantChunks(
  query: string,
  chunks: Chunk[],
  topK: number = 3
): Promise<Chunk[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarity scores
  const chunksWithScores = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Sort by score and return top K
  chunksWithScores.sort((a, b) => b.score - a.score);

  return chunksWithScores.slice(0, topK).map(item => item.chunk);
}
