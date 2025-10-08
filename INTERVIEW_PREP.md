# PaperTrail Interview Preparation Guide

## Project Overview - Your Elevator Pitch

**"I built PaperTrail, a RAG-based research assistant that helps users analyze academic papers by uploading PDFs and chatting with them in real-time. The system extracts text from PDFs, creates embeddings, and uses semantic search to provide contextually relevant answers using Google's Gemini AI. It's built with Next.js 15, deployed on Vercel, and uses PostgreSQL for data persistence."**

---

## Table of Contents
1. [Tech Stack & Why You Chose It](#1-tech-stack--why-you-chose-it)
2. [System Architecture](#2-system-architecture)
3. [Database Design](#3-database-design)
4. [Authentication Implementation](#4-authentication-implementation)
5. [PDF Processing Pipeline](#5-pdf-processing-pipeline)
6. [RAG Implementation](#6-rag-implementation)
7. [Streaming Chat Implementation](#7-streaming-chat-implementation)
8. [Challenges & Solutions](#8-challenges--solutions)
9. [Deployment & DevOps](#9-deployment--devops)
10. [Future Improvements](#10-future-improvements)

---

## 1. Tech Stack & Why You Chose It

### Frontend
- **Next.js 15 (App Router)**: For server-side rendering, built-in API routes, and modern React features
- **React 19**: Latest features including Server Components and improved streaming
- **Tailwind CSS 4**: Utility-first CSS for rapid UI development
- **Radix UI**: Accessible, unstyled components for dialogs, tooltips, etc.
- **react-markdown + rehype-highlight**: For rendering LLM responses with syntax highlighting

**Why?** Next.js provides both frontend and backend in one framework, reducing deployment complexity. The App Router gives better performance with Server Components.

### Backend & APIs
- **Next.js API Routes**: Serverless functions for all endpoints
- **Server-Sent Events (SSE)**: For real-time streaming of AI responses
- **Node.js runtime**: For PDF processing and AI integration

**Why?** Serverless architecture scales automatically and reduces infrastructure costs. SSE is simpler than WebSockets for unidirectional streaming.

### Database & ORM
- **PostgreSQL (Neon)**: Serverless Postgres for scalability
- **Drizzle ORM**: Type-safe database queries with excellent TypeScript support
- **Drizzle Kit**: Migration generation and management

**Why?** Neon offers serverless Postgres with instant scaling. Drizzle provides better type safety than Prisma and is lightweight.

### AI & ML
- **Google Gemini (2.0 Flash)**: Primary chat model for responses
- **Azure OpenAI (text-embedding-ada-002)**: For generating vector embeddings
- **pdf-parse-fork**: PDF text extraction

**Why?** Gemini offers fast streaming at low cost. Azure OpenAI provides high-quality embeddings. Used both to demonstrate multi-provider integration.

### Authentication
- **NextAuth v5**: Complete auth solution with Google OAuth + credentials
- **bcryptjs**: Password hashing
- **Nodemailer**: Email verification

**Why?** NextAuth is the standard for Next.js auth, supporting multiple providers out of the box.

### DevOps & Deployment
- **Vercel**: Production deployment
- **Docker**: Containerization for portability
- **Git**: Version control

**Why?** Vercel offers zero-config deployment for Next.js. Docker ensures the app runs anywhere.

---

## 2. System Architecture

### High-Level Architecture
```
User Request → Next.js Server → Authentication Check → Database Query → AI Processing → Stream Response
                                                     ↓
                                           PDF Processing Pipeline
                                           (Extract → Chunk → Embed → Store)
```

### Key Design Decisions

**1. Monolithic Architecture (Single Next.js App)**
- All functionality in one deployment
- Simpler to develop and maintain
- Background jobs run in-process (not separate workers)

**2. Serverless Design**
- API routes are serverless functions
- Automatically scales with traffic
- No server management required

**3. Database-First Approach**
- All state persisted in PostgreSQL
- No separate vector database (embeddings in JSONB)
- Enables conversation replay without recomputation

---

## 3. Database Design

### Schema Structure (app/database/schema.ts)

**Authentication Tables** (NextAuth schema):
```typescript
- users: User profiles with passwords
- accounts: OAuth provider links (Google)
- sessions: Active user sessions
- verificationTokens: Email verification
```

**Application Tables**:
```typescript
- threads: Conversation sessions
  - Links to users (userId foreign key)
  - Auto-generated title from first message

- messages: Chat messages
  - Links to threads (threadId foreign key)
  - role: 'user' | 'assistant' | 'system'
  - metadata: JSON (citations, artifacts)

- documents: Source materials
  - sourceType: 'pubmed' | 'arxiv' | 'upload'
  - Stores PDF metadata + chunks + embeddings in JSONB
  - Links to user who uploaded (uploadedByUserId)

- messageCitations: Junction table
  - Links messages to source documents
  - Tracks relevance scores

- jobs: Background task tracking
  - type: 'ingestion' | 'pdf_generation' | 'embedding'
  - status: 'pending' | 'processing' | 'completed' | 'failed'
```

### Key Design Patterns

**1. Soft Ownership**
- Documents linked to users but accessible across threads
- Upload once, use in any conversation

**2. Metadata as JSONB**
- Flexible schema for chunks/embeddings
- Easier iteration without migrations

**3. Audit Trail**
- All messages persist with timestamps
- Enables conversation replay

---

## 4. Authentication Implementation

### Two-Factor Authentication Strategy

**1. Google OAuth** (Social Login):
```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true
})
```

**2. Email/Password** (Credentials):
```typescript
CredentialsProvider({
  async authorize(credentials) {
    const user = await db.select().from(users).where(eq(users.email, email));
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }
})
```

### Email Verification Flow
1. User signs up → Password hashed with bcrypt
2. Verification token generated and stored
3. Email sent with verification link via Nodemailer
4. User clicks link → `/api/auth/verify-email` validates token
5. `emailVerified` timestamp updated → Access granted

### Session Management
- **Strategy**: JWT (JSON Web Tokens)
- **Why**: Stateless, no database queries per request
- **Storage**: Encrypted cookie via NextAuth

### Security Features
- Password hashing with bcrypt (10 salt rounds)
- Email verification required
- CSRF protection via NextAuth
- Session expiration handling

---

## 5. PDF Processing Pipeline

### Step-by-Step Implementation

**Step 1: File Upload** (`/api/upload/route.ts`)
```typescript
1. Receive multipart/form-data with PDF file
2. Validate file type (application/pdf)
3. Validate file size (max 10MB)
4. Convert to Buffer
```

**Step 2: Text Extraction**
```typescript
async function extractTextFromPDF(buffer: Buffer) {
  const pdfParse = await import('pdf-parse-fork');
  const data = await pdfParse(buffer);
  return data.text; // Raw text content
}
```

**Step 3: Chunking** (500 words per chunk)
```typescript
function chunkText(text: string, maxWordsPerChunk = 500) {
  // Split by paragraphs (double newlines)
  const paragraphs = text.split(/\n\n+/);

  // Combine paragraphs until ~500 words
  const chunks = [];
  let currentChunk = [];
  let wordCount = 0;

  for (const para of paragraphs) {
    const words = para.split(/\s+/).length;
    if (wordCount + words > maxWordsPerChunk && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'));
      currentChunk = [para];
      wordCount = words;
    } else {
      currentChunk.push(para);
      wordCount += words;
    }
  }
  return chunks;
}
```

**Step 4: Embedding Generation**
```typescript
async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding; // 1536-dimensional vector
}
```

**Step 5: Storage**
```typescript
await db.insert(documents).values({
  sourceType: 'upload',
  title: filename,
  embeddingStatus: 'completed',
  uploadedByUserId: session.user.id,
  metadata: {
    chunks: chunks.map((chunk, index) => ({
      index,
      text: chunk.text,
      embedding: chunk.embedding
    })),
    chunkCount: chunks.length
  }
});
```

### Why This Approach?
- **Paragraph-based chunking**: Preserves semantic meaning
- **~500 words**: Balances context vs. specificity
- **JSONB storage**: Flexible, no separate vector DB needed initially
- **Fallback embeddings**: Hash-based if Azure unavailable

---

## 6. RAG Implementation

### Retrieval-Augmented Generation Flow

**1. Query Processing**
```typescript
// User asks: "What are the key findings?"
const userMessage = "What are the key findings?";
const queryEmbedding = await generateEmbedding(userMessage);
```

**2. Semantic Search** (Cosine Similarity)
```typescript
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function findRelevantChunks(query, chunks, topK = 3) {
  const queryEmbedding = await generateEmbedding(query);
  const scores = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  return scores.sort((a, b) => b.score - a.score).slice(0, topK);
}
```

**3. Context Construction**
```typescript
const relevantChunks = await findRelevantChunks(userMessage, allChunks, 3);

const context = `
Relevant excerpts from uploaded documents:

[Excerpt 1]:
${relevantChunks[0].text}

[Excerpt 2]:
${relevantChunks[1].text}

[Excerpt 3]:
${relevantChunks[2].text}
`;
```

**4. Prompt Engineering**
```typescript
const systemPrompt = `You are a research assistant. Follow these guidelines:

1. ACCURACY: Base answers ONLY on provided excerpts
2. CONCISENESS: Be direct, avoid unnecessary preamble
3. CITATIONS: Reference which excerpt (e.g., "According to Excerpt 1...")
4. STRUCTURE: Use Markdown with headings, lists, bold for key terms

Answer based on the research paper excerpts.`;
```

**5. LLM Query**
```typescript
const chat = model.startChat({
  history: conversationHistory,
  generationConfig: {
    temperature: 0.3, // Lower = more factual
    maxOutputTokens: 2000,
  }
});

const result = await chat.sendMessageStream(userMessage + context);
```

### Key RAG Principles Applied
- **Grounding**: Answers based only on retrieved chunks
- **Citation tracking**: Links responses to source documents
- **Top-K retrieval**: Only most relevant chunks (3)
- **Low temperature**: Reduces hallucination (0.3)

---

## 7. Streaming Chat Implementation

### Server-Sent Events (SSE) Architecture

**Backend: Streaming Endpoint** (`/api/chat/route.ts`)
```typescript
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(message);

      let fullResponse = '';

      // Stream chunks as they arrive
      for await (const chunk of result.stream) {
        const content = chunk.text();
        fullResponse += content;

        // SSE format: "data: {json}\n\n"
        const data = JSON.stringify({
          content,
          threadId,
          done: false
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }

      // Save complete response to DB
      await db.insert(messages).values({
        threadId,
        role: 'assistant',
        content: fullResponse
      });

      // Signal completion
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

**Frontend: Consuming Stream** (chat-interface.tsx)
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message, threadId })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));

      if (data.content) {
        // Append to UI
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }

      if (data.done) {
        // Streaming complete
        setLoading(false);
      }
    }
  }
}
```

### Why SSE Over WebSockets?
- **Simpler**: Unidirectional, no handshake needed
- **HTTP/2 compatible**: Better performance
- **Auto-reconnect**: Built into EventSource API
- **Lightweight**: Less overhead than WebSockets

---

## 8. Challenges & Solutions

### Challenge 1: PDF Text Extraction Quality
**Problem**: Standard pdf-parse was unmaintained, failing on complex PDFs

**Solution**: Switched to `pdf-parse-fork` (maintained fork)
```typescript
const pdfParse = await import('pdf-parse-fork');
const data = await pdfParse(buffer);
```

### Challenge 2: Azure OpenAI Rate Limits
**Problem**: Free tier has strict limits (60 req/min)

**Solution**: Implemented fallback hash-based embeddings
```typescript
async function generateEmbedding(text: string) {
  try {
    return await azureOpenAI.embeddings.create({ input: text });
  } catch {
    // Fallback to simple hash-based embedding
    return createSimpleEmbedding(text);
  }
}
```

### Challenge 3: Email Verification Flow
**Problem**: Users couldn't login until verified, no resend mechanism

**Solution**: Multi-step login with resend capability
```typescript
1. Check if email exists and is verified
2. If not verified, show resend link
3. POST /api/auth/resend-verification generates new token
4. Track verification in verificationTokens table
```

### Challenge 4: Conversation Context Management
**Problem**: LLM losing context in long conversations

**Solution**: Include full conversation history in each request
```typescript
const history = await db.select()
  .from(messages)
  .where(eq(messages.threadId, threadId))
  .orderBy(messages.createdAt);

const geminiHistory = history.map(msg => ({
  role: msg.role === 'user' ? 'user' : 'model',
  parts: [{ text: msg.content }]
}));
```

### Challenge 5: Thread Ownership Security
**Problem**: Users could access other users' threads by guessing IDs

**Solution**: Always verify ownership before operations
```typescript
const [thread] = await db.select()
  .from(threads)
  .where(eq(threads.id, threadId));

if (thread.userId !== session.user.id) {
  return new Response('Unauthorized', { status: 403 });
}
```

### Challenge 6: Streaming Response Persistence
**Problem**: Streamed responses not saved to database

**Solution**: Accumulate full response while streaming, save at end
```typescript
let fullResponse = '';
for await (const chunk of result.stream) {
  fullResponse += chunk.text();
  // Stream to client
}
// Save complete response
await db.insert(messages).values({ content: fullResponse });
```

---

## 9. Deployment & DevOps

### Local Development
```bash
1. Clone repo
2. npm install
3. Copy .env.example to .env
4. Set DATABASE_URL (Neon Postgres)
5. npx drizzle-kit push (sync schema)
6. npm run dev (start at localhost:3000)
```

### Database Management
```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Direct schema push (dev only)
npx drizzle-kit push

# Visual DB explorer
npx drizzle-kit studio
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t papertrail .
docker run -p 3000:3000 --env-file .env papertrail

# Or with docker-compose
docker-compose up --build
```

### Vercel Deployment
```bash
1. Connect GitHub repo to Vercel
2. Set environment variables in dashboard:
   - DATABASE_URL
   - NEXTAUTH_URL, NEXTAUTH_SECRET
   - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
   - AZURE_OPENAI_*, GEMINI_API_KEY
3. Deploy automatically on git push
```

### Environment Variables
**Required**:
- `DATABASE_URL`: Neon Postgres connection string
- `NEXTAUTH_URL`: App URL (https://paper-trail-sooty.vercel.app)
- `NEXTAUTH_SECRET`: Random secret for JWT signing
- `GEMINI_API_KEY`: Google AI API key
- `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`: For embeddings

**Optional**:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: OAuth
- `EMAIL_USER`, `EMAIL_PASSWORD`: Nodemailer

### Production Considerations
1. **Database migrations**: Run `drizzle-kit migrate` before deploy
2. **Connection pooling**: Neon handles automatically (serverless)
3. **Secret rotation**: Use environment variables, never commit secrets
4. **Error monitoring**: Console logs → Vercel dashboard

---

## 10. Future Improvements

### Short-term Enhancements
1. **Vector Database Integration**
   - Migrate from JSONB to Qdrant or pgvector
   - Enable hybrid search (dense + sparse)
   - Better performance at scale

2. **PubMed/arXiv Integration**
   - Automated corpus ingestion
   - Scheduled jobs for new papers
   - Metadata enrichment (DOI, citations)

3. **Download Features**
   - Export chat as PDF/Markdown
   - References.csv generation
   - Source PDFs bundle (respecting licenses)

4. **Advanced RAG**
   - Reranking with cross-encoders
   - Multi-query retrieval
   - Contextual chunk embeddings

### Long-term Vision
1. **Multi-modal Support**
   - Extract images/charts from PDFs
   - Vision model for diagram analysis
   - LaTeX equation parsing

2. **Collaborative Features**
   - Share threads with team members
   - Annotation and highlighting
   - Shared document libraries

3. **Analytics Dashboard**
   - Usage metrics
   - Popular topics
   - Citation graphs

4. **Enterprise Features**
   - SSO integration (SAML, OIDC)
   - Role-based access control
   - Audit logs

---

## Key Talking Points for Interview

### 1. **Technical Depth**
- "I implemented semantic search using cosine similarity on Azure OpenAI embeddings"
- "The streaming chat uses Server-Sent Events for real-time updates"
- "I designed the database schema with soft ownership - users can upload documents once and use them across multiple conversations"

### 2. **Problem Solving**
- "When Azure hit rate limits, I built a fallback hash-based embedding system"
- "I solved the email verification UX by implementing a multi-step login flow with resend capability"
- "Thread security was critical, so I always verify ownership before any operation"

### 3. **Architecture Decisions**
- "I chose a monolithic Next.js architecture for simplicity, but designed it to split into microservices later"
- "Storing embeddings in JSONB was pragmatic for MVP, but I planned for vector DB migration"
- "JWT sessions over database sessions for stateless serverless functions"

### 4. **Trade-offs**
- "JSONB embeddings vs. vector DB: faster development vs. better performance"
- "Gemini vs. GPT-4: cost vs. quality (Gemini 2.0 Flash is excellent for price)"
- "Serverless vs. traditional: auto-scaling vs. cold starts"

### 5. **Best Practices**
- "Type-safe database queries with Drizzle ORM"
- "Security-first: bcrypt hashing, email verification, thread ownership checks"
- "Containerized with Docker for cloud-agnostic deployment"

---

## Sample Interview Q&A

**Q: Walk me through what happens when a user uploads a PDF.**

**A:** "When a user uploads a PDF:

1. The file is validated (type, size) in `/api/upload/route.ts`
2. It's converted to a Buffer and passed to `extractTextFromPDF()` which uses pdf-parse-fork
3. The text is chunked into ~500-word segments using paragraph-based chunking
4. Each chunk is embedded using Azure OpenAI's text-embedding-ada-002
5. The chunks and embeddings are stored in the documents table's metadata JSONB field
6. When the user asks a question, we:
   - Generate an embedding for the query
   - Calculate cosine similarity with all chunks
   - Return the top 3 most relevant chunks
   - Inject them as context into the Gemini prompt
   - Stream the AI response back via SSE

This is a classic RAG pipeline: Retrieval (semantic search), Augmentation (context injection), Generation (LLM response)."

---

**Q: How did you handle authentication?**

**A:** "I used NextAuth v5 with a dual authentication strategy:

1. **Google OAuth**: For frictionless social login
2. **Email/Password**: With bcrypt hashing and email verification

The flow is:
- User signs up → password hashed → verification email sent
- Verification link contains a token → validates → sets emailVerified timestamp
- Login checks if email is verified before granting access
- Sessions are JWT-based (stateless) for serverless compatibility

I also implemented a resend verification feature for better UX when users don't receive the email."

---

**Q: What was the biggest technical challenge?**

**A:** "The biggest challenge was implementing real-time streaming while maintaining data consistency.

The issue: Gemini streams responses token-by-token, but I needed to save the complete message to the database for conversation history.

Solution:
- Accumulate the full response in a variable while streaming
- Send each chunk to the client via SSE
- Only save to database when streaming completes
- Handle errors gracefully (rate limits, network issues)

This ensures the UI feels responsive (real-time updates) while maintaining a complete, replayable conversation history."

---

**Q: How would you scale this application?**

**A:** "Current architecture is serverless and scales automatically, but for high load:

**Short-term** (100K users):
- Migrate embeddings to pgvector (in-database vector search)
- Add Redis for session caching
- Implement request queuing for rate limit handling

**Medium-term** (1M users):
- Split into microservices (API gateway, chat service, ingestion service)
- Dedicated vector database (Qdrant or Pinecone)
- CDN for static assets
- Read replicas for database

**Long-term** (10M users):
- Multi-region deployment
- Sharded database (by user_id)
- Distributed vector search
- Async job processing (BullMQ/Kafka)

The beauty of the current design is it's modular - I can extract services without rewriting core logic."

---

## Confidence Boosters

### What You Did Well
✅ Full-stack implementation (frontend, backend, database, AI)
✅ Production deployment with real users
✅ Modern tech stack (Next.js 15, React 19, Drizzle)
✅ Security best practices (auth, verification, ownership checks)
✅ Real-time features (SSE streaming)
✅ AI/ML integration (embeddings, RAG, LLMs)
✅ Cloud deployment (Vercel, Docker, Neon)

### Your Unique Strengths
- **End-to-end ownership**: You built every layer
- **AI expertise**: Implemented RAG from scratch, not just API calls
- **Production experience**: Deployed and handling real users
- **Architecture thinking**: Designed for current scale but planned for growth

### Remember
- You built a complete, working product
- You made thoughtful trade-offs (JSONB vs vector DB, etc.)
- You solved real problems (rate limits, streaming, security)
- You deployed to production successfully

**You've got this! 🚀**
