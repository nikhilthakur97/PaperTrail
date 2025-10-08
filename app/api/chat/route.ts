import { NextRequest } from 'next/server';
import { auth } from '@/app/lib/auth';
import { db } from '@/app/database/db-server';
import { threads, messages, documents } from '@/app/database/schema';
import { eq } from 'drizzle-orm';
import { model } from '@/app/lib/gemini';
import { findRelevantMultimodalChunks, type MultimodalChunk } from '@/app/lib/pdf-multimodal-processor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { message, threadId } = body;

    if (!message || typeof message !== 'string') {
      return new Response('Invalid message', { status: 400 });
    }

    let currentThreadId = threadId;

    // Create new thread if not provided
    if (!currentThreadId) {
      const [newThread] = await db
        .insert(threads)
        .values({
          userId: session.user.id,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        })
        .returning();
      currentThreadId = newThread.id;
    } else {
      // Verify thread belongs to user
      const [thread] = await db
        .select()
        .from(threads)
        .where(eq(threads.id, currentThreadId))
        .limit(1);

      if (!thread || thread.userId !== session.user.id) {
        return new Response('Thread not found', { status: 404 });
      }
    }

    // Save user message
    await db.insert(messages).values({
      threadId: currentThreadId,
      role: 'user',
      content: message,
    });

    // Fetch conversation history for context
    const conversationHistory = await db
      .select()
      .from(messages)
      .where(eq(messages.threadId, currentThreadId))
      .orderBy(messages.createdAt);

    // Fetch uploaded documents for this user (not just this thread)
    // This allows users to upload documents once and use them across conversations
    const uploadedDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.uploadedByUserId, session.user.id));

    // Retrieve relevant context from uploaded documents (multimodal)
    let contextFromDocuments = '';
    let hasImageContext = false;
    if (uploadedDocs.length > 0) {
      // Collect all chunks from all documents
      const allChunks: MultimodalChunk[] = [];
      uploadedDocs.forEach((doc) => {
        if (doc.metadata && typeof doc.metadata === 'object' && 'chunks' in doc.metadata) {
          const docChunks = (doc.metadata as { chunks?: MultimodalChunk[] }).chunks || [];
          allChunks.push(...docChunks);
        }
      });

      if (allChunks.length > 0) {
        // Find relevant chunks (text and images) for the current user message
        const relevantChunks = await findRelevantMultimodalChunks(message, allChunks, 5);

        if (relevantChunks.length > 0) {
          contextFromDocuments = '\n\nRelevant excerpts from uploaded documents:\n\n';

          relevantChunks.forEach((chunk, idx) => {
            if (chunk.type === 'text') {
              contextFromDocuments += `[Text Excerpt ${idx + 1}]:\n${chunk.text}\n\n`;
            } else if (chunk.type === 'image') {
              hasImageContext = true;
              contextFromDocuments += `[Visual Content ${idx + 1} - Page ${chunk.pageNumber}]:\n${chunk.description}\n\n`;
            }
          });
        }
      }
    }

    // Prepare prompt for Gemini
    const systemPrompt = uploadedDocs.length > 0
      ? `You are a research assistant specialized in analyzing academic papers. Follow these guidelines:

1. ACCURACY: Base your answers ONLY on the provided excerpts. Do not hallucinate or add information not present in the excerpts.

2. CONCISENESS: Be direct and to the point. Avoid unnecessary preamble or repetition.

3. STRUCTURE: Use clear Markdown formatting with proper spacing:
   - Use ## for main section headings (e.g., "## Paper Title", "## Research Focus")
   - Add blank lines before and after headings
   - Use **bold** for key terms and important concepts
   - Use bullet points (- or *) for lists
   - Add blank lines between different sections
   - Use > for important quotes or findings
   - Use numbered lists (1., 2., 3.) for sequential information

4. TABLES AND VISUAL CONTENT:
   ${hasImageContext ? '- Visual Content excerpts include tables, charts, and diagrams that have been pre-analyzed\n   - When referencing tables, maintain the Markdown table format provided\n   - When referencing charts/graphs, cite the specific data points mentioned\n   - Always cite which Visual Content number you are referencing' : ''}

5. CHART GENERATION:
   - When presenting tabular data or statistics, you can ALSO create visual charts
   - Use this special format for charts:
   \`\`\`chart:TYPE
   {
     "title": "Chart Title",
     "labels": ["Label1", "Label2", "Label3"],
     "datasets": [{"label": "Data Series", "data": [value1, value2, value3]}]
   }
   \`\`\`
   - Available chart types: pie, bar, line
   - For pie charts: Use when showing proportions or percentages (e.g., distribution, composition)
   - For bar charts: Use when comparing categories or groups
   - For line charts: Use when showing trends over time or continuous data
   - Example pie chart:
   \`\`\`chart:pie
   {
     "title": "Treatment Response Distribution",
     "labels": ["Positive Response", "Partial Response", "No Response"],
     "datasets": [{"label": "Response Rate", "data": [67, 23, 10]}]
   }
   \`\`\`

6. CITATIONS: When referencing information, mention which excerpt it comes from (e.g., "According to Text Excerpt 1..." or "As shown in Visual Content 2...")

7. FORMATTING EXAMPLE:
## Main Topic

Brief introduction.

**Key Point**: Important detail here.

- First item
- Second item
- Third item

${hasImageContext ? `## Data from Visual Content

According to Visual Content 1:

| Column 1 | Column 2 |
|----------|----------|
| Data     | Data     |

### Visual Representation

\`\`\`chart:pie
{
  "title": "Data Distribution",
  "labels": ["Category A", "Category B"],
  "datasets": [{"label": "Values", "data": [60, 40]}]
}
\`\`\`

` : ''}## Next Section

More information here.

Answer the user's question based on the provided research paper excerpts.`
      : `You are a research assistant for scientific papers. Follow these guidelines:

1. ACCURACY: Provide factual, well-researched information about scientific topics.
2. CONCISENESS: Be direct and avoid unnecessary verbosity.
3. STRUCTURE: Use clear Markdown formatting with headings, lists, and emphasis.
4. CLARITY: Explain complex concepts in accessible language.

Provide accurate, well-formatted responses to research questions.`;

    // Build conversation history for Gemini
    const geminiHistory = conversationHistory.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Get the current user message with context
    const currentMessage = message + (contextFromDocuments || '');

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Start Gemini chat with history (include system prompt in first message of history)
          const chatHistory = geminiHistory.length === 0
            ? [{ role: 'user', parts: [{ text: systemPrompt }] }, { role: 'model', parts: [{ text: 'Understood. I will follow these guidelines when analyzing research papers and answering questions.' }] }]
            : geminiHistory;

          const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
              temperature: 0.3, // Lower temperature for more focused, accurate responses
              maxOutputTokens: 2000,
              topP: 0.8,
              topK: 40,
            },
          });

          // Stream the response
          const result = await chat.sendMessageStream(currentMessage);

          let fullResponse = '';

          // Stream the response
          for await (const chunk of result.stream) {
            const content = chunk.text();
            if (content) {
              fullResponse += content;

              // Send SSE format
              const data = JSON.stringify({
                content,
                threadId: currentThreadId,
                done: false,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          // Save assistant response to database
          await db.insert(messages).values({
            threadId: currentThreadId,
            role: 'assistant',
            content: fullResponse,
            metadata: {
              streaming_complete: true,
              model: 'gemini-2.0-flash-exp',
            },
          });

          // Send final message
          const finalData = JSON.stringify({
            content: '',
            threadId: currentThreadId,
            done: true,
          });
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
          controller.close();
        } catch (error: unknown) {
          console.error('Streaming error:', error);

          // Handle rate limit errors specifically
          let errorMessage = 'Failed to generate response';
          if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
            errorMessage = 'Rate limit exceeded. Please wait 60 seconds and try again. Your Azure OpenAI tier has limited tokens/requests per minute.';
          } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
            errorMessage = error.message;
          }

          const errorData = JSON.stringify({
            error: errorMessage,
            done: true,
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
