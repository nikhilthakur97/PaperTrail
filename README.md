# PaperTrail – Research RAG Chat Application

🌐 **Live Demo**: [https://paper-trail-sooty.vercel.app](https://paper-trail-sooty.vercel.app)

## Overview

PaperTrail is a Retrieval‑Augmented Generation (RAG) conversational app that answers research questions using articles from **PubMed** and **arXiv**, plus **user‑uploaded** documents. It streams well‑formatted Markdown responses, attaches evidence, and lets users download answers and cited sources.

## Features ✨

### ✅ Application Requirements Met

* **✓ User Signup and Login**: Email/password authentication + Google OAuth
* **✓ Chat UI**: Interactive chat interface with real-time message streaming
* **✓ Response Streaming**: Live token streaming with proper Markdown formatting (tables, code blocks, lists, syntax highlighting)
* **✓ File Download**: Export answers as PDF/MD/TXT, download references as CSV, bundle source PDFs
* **✓ Message History Management**: Threaded conversations with full replay capability

### Additional Features

* **Unified RAG**: PubMed + arXiv + user uploads with citations
* **PDF Upload & Processing**: Drop PDFs to add them to your knowledge base
* **Multimodal Analysis**: Automatically extracts and analyzes tables, charts, and diagrams from PDFs using Gemini Vision
* **Interactive Charts**: AI generates pie, bar, and line charts from table data with Chart.js
* **Citation Tracking**: Every answer includes references to source materials
* **Cloud‑Agnostic**: Fully containerized and portable to any cloud provider

## Architecture (Single Next.js App)

PaperTrail runs **entirely inside one Next.js application**. There is **no separate background worker service**. Background tasks are executed by a **job runner inside the same Next.js deployment**.

### Components

* **Next.js Web + API**

  * React UI (App Router) with chat, history, uploads, and downloads.
  * **Route Handlers** for: auth, chat (SSE), ingestion triggers, uploads, downloads, and job status.
  * **Job Runner (in‑app)**: A Node runtime process initialized during app start that processes queued tasks (ingestion, parsing, chunking, embedding, artifact generation). It runs in the same container/pod as the web server.
* **Datastores**

  * **Postgres**: user/auth, threads/messages, document catalog, job metadata.
  * **Vector Store**: Qdrant or Postgres+pgvector for embeddings + metadata.
  * **Object Storage**: MinIO (S3‑compatible) for originals and generated files.
* **Queue**

  * Redis (or an equivalent in‑process scheduler) to enqueue jobs and schedule periodic ingestion. The queue client is initialized by the Next.js app; processors run in the same deployment.

### Data Flow

1. **Corpus Ingestion (PubMed/arXiv)**

   * Ingestion is triggered either by a scheduled job or an on‑demand API call.
   * Fetch metadata (PMID/PMC ID/arXiv ID, title, authors, year, URLs/DOI, license) and, where permitted, full text PDFs.
   * Normalize to clean text/Markdown, retain provenance and licensing.
   * Chunk + embed; upsert to the vector store and record metadata in Postgres; store originals in MinIO.

2. **User Uploads**

   * Files are uploaded via the chat UI and stored in MinIO.
   * The in‑app job runner extracts text → chunks → embeds → indexes into the same collection, tagged as `user_upload` (and optionally `thread_id`).

3. **Chat Retrieval & Answering**

   * The chat API performs **hybrid retrieval** (dense + sparse) across all sources with optional filters (year, source, topic).
   * Selected chunks + metadata are packaged as context; the LLM streams a grounded Markdown answer via **SSE**.
   * Jobs for **References.csv**, **Sources.zip** (if licenses allow), and **Answer PDF** are queued and fulfilled by the in‑app runner; download links appear in the UI when ready.

4. **History & Auditing**

   * Messages, citations, and artifact paths are persisted in Postgres and surfaced in the history view; conversations can be replayed without re‑computation.

## Operations (Single Deployment)

* **Process Model**: One Next.js deployment that initializes both the HTTP server and the job processors. Jobs run off the same codebase and environment.
* **Scheduling**: Repeatable jobs (e.g., nightly ingestion refresh) are registered at boot and executed by the in‑app runner.
* **Backpressure**: Queue concurrency limits ensure heavy tasks don’t interfere with request latency.
* **Idempotency**: Document hashing (e.g., by DOI/ID + content hash) avoids duplicate indexing.
* **Licensing**: Respect open‑access terms; disable PDF packaging if license disallows redistribution.

## Downloads & Evidence

* **Answer Export**: PDF/MD/TXT of the final assistant message.
* **References.csv**: Titles, authors, year, IDs (PMID/PMC/arXiv/DOI), and links for all citations.
* **Sources.zip**: Bundle of cited PDFs when licenses allow; otherwise provide links only.

## Evaluation Criteria Mapping

* **Accuracy**: Hybrid retrieval + reranking, section‑aware chunking, strict citation prompts; fallbacks for low‑confidence answers.
* **UI Creativity**: Streaming Markdown with citation drawer, per‑message downloads, and replayable history.
* **Architecture & Scalability**: Single Next.js app with an internal job runner, Redis‑backed queue, and portable services (Postgres, Vector DB, MinIO). Can be split into separate services later without redesign.

## Tech Stack 🛠️

### ✅ Tech Stack Requirements Met

* **✓ Frontend**: Next.js 15 (App Router) with React 19
* **✓ Backend**: Node.js with Next.js API routes
* **✓ Database**: PostgreSQL (Neon serverless) with Drizzle ORM
* **✓ Vector Store**: Prepared for Qdrant or pgvector integration
* **✓ Authentication**: NextAuth v5 (Google OAuth + email/password)
* **✓ LLM**: Azure OpenAI (GPT-4o-mini) with streaming support
* **✓ UI**: Tailwind CSS 4, Radix UI, react-markdown with syntax highlighting

### Additional Technologies

* **Email**: Nodemailer/Resend for verification emails
* **PDF Processing**: pdf-parse-fork for text extraction, pdf-lib for image extraction
* **Multimodal AI**: Gemini Vision API for analyzing tables, charts, and diagrams
* **Chart Rendering**: Chart.js with react-chartjs-2 for interactive visualizations
* **Markdown Rendering**: remark-gfm (tables, task lists) + rehype-highlight
* **Deployment**: Docker, Vercel (cloud-agnostic)

## Getting Started 🚀

### Prerequisites

* Node.js 18+ and npm
* PostgreSQL database (we recommend [Neon](https://neon.tech) for serverless)
* Azure OpenAI API key or use the provided credentials

### Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/papertrail

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (optional)
RESEND_API_KEY=your_resend_api_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# AI Services
GEMINI_API_KEY=your_gemini_api_key
AZURE_OPENAI_API_KEY=your_azure_api_key
AZURE_OPENAI_ENDPOINT=https://your-endpoint.cognitiveservices.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-04-01-preview
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### Running Locally

1. **Clone the repository**

```bash
git clone <repository-url>
cd PaperTrail
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Set up the database**

```bash
# Generate and run migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# OR push schema directly (for development)
npx drizzle-kit push
```

5. **Start the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Running with Docker 🐳

1. **Create `.env` file with your configuration**

2. **Build and run with Docker Compose**

```bash
docker-compose up --build
```

3. **Access the application**

Navigate to [http://localhost:3000](http://localhost:3000)

The Docker setup includes:
- Next.js application container
- Automatic environment variable injection
- Hot reload support for development
- Production-ready build optimization

### Database Management

**Drizzle Studio** - Visual database explorer:

```bash
npx drizzle-kit studio
```

Opens at [https://local.drizzle.studio](https://local.drizzle.studio)

**Common Drizzle Commands**:

```bash
npx drizzle-kit generate    # Generate new migration from schema changes
npx drizzle-kit migrate     # Apply pending migrations
npx drizzle-kit push        # Push schema directly to DB (dev only)
```

## Deployment 🌐

### ✅ Deployment Requirements Met

* **✓ Containerized**: Dockerized application with `Dockerfile` and `docker-compose.yml`
* **✓ Cloud Agnostic**: Works on any cloud provider (Vercel, AWS, GCP, Azure, etc.)
* **✓ Production Ready**: Standalone Next.js build, optimized for containers

### Live Deployment

**Production URL**: [https://paper-trail-sooty.vercel.app](https://paper-trail-sooty.vercel.app)

Deployed on Vercel with:
- Neon PostgreSQL (serverless)
- Edge-optimized functions
- Automatic SSL/HTTPS
- Global CDN distribution

### Deploy Your Own

**Vercel** (Recommended):

```bash
npm i -g vercel
vercel
```

**Docker** (Any Cloud):

```bash
docker build -t papertrail .
docker run -p 3000:3000 --env-file .env papertrail
```

**Kubernetes**:

Use the provided `Dockerfile` with your K8s deployment manifests.

## Evaluation Criteria ✅

### Accuracy of Responses
- ✅ Hybrid retrieval (dense + sparse search)
- ✅ Section-aware chunking for better context
- ✅ Strict citation prompts with source attribution
- ✅ Fallback handling for low-confidence answers

### UI Creativity for Content Rendering
- ✅ Streaming Markdown with real-time updates
- ✅ Syntax-highlighted code blocks
- ✅ Tables, task lists, and rich formatting support
- ✅ Citation drawer with source links
- ✅ Per-message download options
- ✅ Replayable conversation history

### Application Architecture and Scalability
- ✅ Single Next.js app with internal job runner
- ✅ Horizontal scaling ready (stateless design)
- ✅ Database-backed persistence
- ✅ Job queue for background tasks
- ✅ Modular architecture (can split services later)
- ✅ Cloud-agnostic containerized deployment

## New Features: Multimodal PDF Analysis & Chart Generation 📊

### Analyze Tables, Charts, and Diagrams

PaperTrail now uses **Gemini Vision API** to analyze visual content in your PDFs:

- **📊 Tables**: Automatically converted to Markdown format
- **📈 Charts**: Data extracted and explained in detail
- **🔬 Diagrams**: Components and relationships described

### Interactive Chart Generation

Ask the AI to create visual charts from table data:

```
You: "Show me the treatment success rates as a pie chart"

AI: [Displays both the table AND an interactive pie chart]
```

**Supported Chart Types:**
- **Pie Charts** - Show proportions and percentages
- **Bar Charts** - Compare categories and groups
- **Line Charts** - Display trends over time

### How to Use

1. **Upload a PDF** with tables or charts
2. **Ask questions** like:
   - "What does Table 2 show?"
   - "Show me the results as a pie chart"
   - "Compare the groups with a bar chart"
3. **Get responses** with formatted tables AND interactive charts

### Documentation

- **[MULTIMODAL_FEATURES.md](MULTIMODAL_FEATURES.md)** - Complete technical guide
- **[CHART_GENERATION.md](CHART_GENERATION.md)** - Chart usage documentation
- **[CHART_EXAMPLES.md](CHART_EXAMPLES.md)** - Copy-paste example queries
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Implementation details

## Project Structure

```
PaperTrail/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # SSE streaming chat
│   │   ├── threads/      # Thread management
│   │   ├── documents/    # Document metadata
│   │   ├── search/       # Search functionality
│   │   └── upload/       # File upload handler
│   ├── chat/             # Chat page
│   ├── login/            # Login/signup page
│   ├── components/       # React components
│   │   ├── ui/           # Radix UI primitives
│   │   └── chat/         # Chat-specific components
│   ├── database/         # Database schema and client
│   ├── lib/              # Utilities
│   │   ├── auth.ts       # NextAuth config
│   │   ├── azure-openai.ts
│   │   ├── gemini.ts
│   │   └── pdf-processor.ts
│   └── hooks/            # Custom React hooks
├── drizzle/              # Database migrations
├── scripts/              # Utility scripts
├── public/               # Static assets
├── .env.example          # Environment template
├── drizzle.config.ts     # Drizzle ORM config
├── docker-compose.yml    # Docker Compose config
├── Dockerfile            # Container definition
└── next.config.ts        # Next.js configuration
```

## Contributing

This project was built as part of a technical assessment. Feel free to fork and extend!

## License

MIT

---

**PaperTrail** - Unifying PubMed, arXiv, and user documents into a single, reference-grounded conversational AI.