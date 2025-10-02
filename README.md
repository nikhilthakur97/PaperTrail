# PaperTrail – Research RAG Chat Application

## Overview

PaperTrail is a Retrieval‑Augmented Generation (RAG) conversational app that answers research questions using articles from **PubMed** and **arXiv**, plus **user‑uploaded** documents. It streams well‑formatted Markdown responses, attaches evidence, and lets users download answers and cited sources.

## Features

* **Single‑User Authentication**: Simple signup/login.
* **Chat UI**: Live token streaming, Markdown (tables, code fences, math), copy/export.
* **Unified RAG**: PubMed + arXiv + uploads in one index with citations.
* **Uploads**: Drop PDFs/Docs; they’re parsed, chunked, embedded, and searchable immediately.
* **Downloads**:

  * Answer export (PDF / Markdown / Text)
  * References (CSV)
  * Source pack (ZIP of cited open‑access PDFs, when licensing permits)
* **History**: Threaded conversations with replay and attachments.
* **Cloud‑Agnostic**: Fully containerized; portable to any provider.

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

## Deployment

* **Containers**: One image for the Next.js app. The same container runs the web server and initializes job processors on startup.
* **Services**: Postgres, Vector DB (Qdrant or pgvector), MinIO, and Redis are provisioned as independent containers/services.
* **Cloud‑Agnostic**: Works with Docker Compose locally and Kubernetes in production. Persistent volumes back Postgres/Vector DB/MinIO.

---

**PaperTrail** unifies PubMed, arXiv, and user documents into a single, reference‑grounded chat—no separate worker service required; background jobs run inside Next.js.