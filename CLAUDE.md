# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PaperTrail** is a Next.js 15 RAG (Retrieval-Augmented Generation) chat application that answers research questions using PubMed, arXiv, and user-uploaded documents. It streams Markdown responses with citations and allows exporting answers and source materials.

**Key characteristic**: This is a **single Next.js application** with an in-app job runner. There is no separate background worker service—background tasks (ingestion, PDF generation, embedding, artifact creation) run inside the same Next.js deployment via a job queue.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Language**: TypeScript
- **Database**: PostgreSQL via Neon serverless + Drizzle ORM
- **Authentication**: NextAuth v5 (supports Google OAuth + email/password credentials)
- **LLM**: Azure OpenAI (GPT-4o-mini) with streaming support
- **UI**: React 19, Radix UI primitives, Tailwind CSS 4, @tailwindcss/typography for Markdown rendering
- **Markdown**: react-markdown with remark-gfm (tables, task lists) and rehype-highlight (syntax highlighting)
- **Future integrations** (per architecture):
  - Vector DB: Qdrant or pgvector for embeddings
  - Object Storage: MinIO (S3-compatible) for PDFs and generated files
  - Queue: Redis for background job orchestration

## Common Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database (Drizzle)
```bash
npx drizzle-kit generate    # Generate new migration from schema changes
npx drizzle-kit migrate     # Apply pending migrations
npx drizzle-kit push        # Push schema directly to DB (dev only)
npx drizzle-kit studio      # Open Drizzle Studio GUI
```

Drizzle config: `drizzle.config.ts` points to `app/database/schema.ts` and outputs migrations to `./drizzle`.

## Architecture

### Single-App Design
- **Web + API**: Next.js App Router handles UI, API routes, and SSE streaming
- **Job Runner**: Initialized at app startup within the same process/container
- **No microservices**: All functionality (auth, chat, uploads, background jobs) runs in one deployment

### Core Data Models (`app/database/schema.ts`)

**Authentication** (NextAuth):
- `users`: User profiles with optional `passwordHash` for credentials or OAuth
- `accounts`: OAuth provider linkage (Google)
- `sessions`: Active sessions (optional with JWT strategy)
- `verificationTokens`: Email verification

**Application**:
- `threads`: Conversation sessions (belong to `users`)
- `messages`: Individual chat turns with `role` (user/assistant/system), `content`, and `metadata` (citations, artifacts)
- `documents`: Source materials from PubMed, arXiv, or uploads. Tracks `sourceType`, `externalId` (PMID/arXiv ID), licensing (`canRedistribute`), and `embeddingStatus`
- `messageCitations`: Junction table linking messages to cited documents with `relevanceScore` and `chunkIndex`
- `jobs`: Background task tracking with `type` (ingestion, pdf_generation, embedding, artifact_creation), `status` (pending/processing/completed/failed), `payload`, `result`, and `progress`

### Data Flow

1. **Corpus Ingestion**: Scheduled or on-demand jobs fetch PubMed/arXiv metadata and full-text, chunk, embed, and store in vector DB + Postgres + MinIO
2. **User Uploads**: Files uploaded via chat → stored in MinIO → job queued → text extracted, chunked, embedded, indexed (tagged with `uploadedInThreadId`)
3. **Chat**: Hybrid retrieval (dense + sparse) across all sources → LLM streams Markdown answer via SSE → citations and artifact generation jobs queued
4. **Downloads**: Jobs generate Answer PDF, References.csv, and Sources.zip (when licenses allow); links appear in UI when ready

### Key Directories

- `app/database/`: Drizzle schema (`schema.ts`) and DB client (`db-server.ts` using Neon serverless)
- `app/lib/`: Shared utilities
  - `auth.ts`: NextAuth configuration
  - `azure-openai.ts`: Azure OpenAI client initialization
  - `email.ts`, `utils.ts`: Other utilities
- `app/api/`: Route handlers
  - `/api/auth/*`: Authentication endpoints
  - `/api/chat`: SSE streaming chat endpoint with Azure OpenAI integration
- `app/components/`: React components
  - `app/components/ui/`: Radix UI primitives (Button, Dialog, Card, etc.)
  - `app/components/chat/`: Chat-specific components (`chat-interface.tsx` with Markdown streaming)
- `app/hooks/`: Custom React hooks (`use-mobile.ts`)
- `app/chat/`, `app/login/`: Route group pages

## Authentication

NextAuth v5 with Drizzle adapter:
- **Providers**: Google OAuth + Credentials (email/password with bcrypt)
- **Session**: JWT strategy (stateless, faster)
- **Custom pages**: `/login` for sign-in
- **Features**: Email verification (`verificationTokens`), account linking (`allowDangerousEmailAccountLinking`)

Config: `app/lib/auth.ts`
API routes: `app/api/auth/**/route.ts`

## Database Conventions

- **ORM**: Drizzle with relational queries enabled
- **Schema location**: `app/database/schema.ts`
- **Migrations**: Auto-generated via `drizzle-kit generate`, stored in `./drizzle`
- **Connection**: Neon serverless HTTP (no pooling needed)
- **Type exports**: All tables export `Select` and `Insert` types (e.g., `User`, `NewUser`)

## UI Components

- **Radix UI** for accessible primitives (Dialog, Tooltip, Separator, etc.)
- **Tailwind 4** for styling with `@tailwindcss/postcss`
- **shadcn/ui conventions**: Components in `app/components/ui/` follow shadcn patterns
- **Icons**: `lucide-react`
- **Carousels**: `embla-carousel-react`

## LLM Integration

**Azure OpenAI Configuration** (`app/lib/azure-openai.ts`):
- Client initialized with credentials from environment variables
- Model: GPT-4o-mini
- Supports streaming completions via `streamChatCompletions`

**Environment Variables Required**:
```
AZURE_OPENAI_API_KEY=<api_key>
AZURE_OPENAI_ENDPOINT=https://wodfoundry.cognitiveservices.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-04-01-preview
```

**Chat API** (`app/api/chat/route.ts`):
- POST endpoint that accepts `{ message, threadId }`
- Creates or validates thread ownership
- Fetches conversation history for context
- Streams response via SSE (Server-Sent Events)
- Saves both user and assistant messages to database
- Returns JSON chunks: `{ content, threadId, done }`

**Frontend Streaming** (`app/components/chat/chat-interface.tsx`):
- Fetches `/api/chat` with message
- Reads SSE stream using ReadableStream API
- Updates UI in real-time as tokens arrive
- Renders assistant messages with Markdown (react-markdown + remark-gfm + rehype-highlight)
- Supports code blocks, tables, lists, and syntax highlighting

## Important Notes

- **Turbopack**: Always use `--turbopack` flag for dev and build (already in scripts)
- **Job idempotency**: Use document hashing (DOI + content hash) to prevent duplicate indexing
- **Licensing**: Check `canRedistribute` before bundling PDFs; otherwise provide links only
- **SSE streaming**: Chat responses use Server-Sent Events for live token streaming from Azure OpenAI
- **No separate workers**: Background jobs run in-process via the job runner, not external services
- **Markdown rendering**: Assistant responses support full GFM (tables, task lists, code fencing with syntax highlighting)
