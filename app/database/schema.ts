import { pgTable, text, timestamp, integer, jsonb, boolean, pgEnum, index, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccount } from 'next-auth/adapters';

// ===========================
// ENUMS
// ===========================

export const roleEnum = pgEnum('role', ['user', 'assistant', 'system']);
export const sourceTypeEnum = pgEnum('source_type', ['pubmed', 'arxiv', 'upload']);
export const jobStatusEnum = pgEnum('job_status', ['pending', 'processing', 'completed', 'failed']);
export const jobTypeEnum = pgEnum('job_type', ['ingestion', 'pdf_generation', 'embedding', 'artifact_creation']);
export const embeddingStatusEnum = pgEnum('embedding_status', ['pending', 'processing', 'completed', 'failed']);

// ===========================
// AUTHENTICATION TABLES (NextAuth)
// ===========================

/**
 * Users table - stores user profiles
 * Supports both email/password and OAuth (Google) login
 */
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  // Password hash only for email/password users (null for OAuth-only)
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

/**
 * Accounts table - links users to OAuth providers
 * One user can have multiple accounts (Google + credentials)
 */
export const accounts = pgTable('accounts', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccount['type']>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}));

/**
 * Sessions table - tracks active user sessions
 * Optional with JWT strategy but useful for session management
 */
export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

/**
 * Verification tokens - for email verification
 */
export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// ===========================
// APPLICATION TABLES
// ===========================

/**
 * Threads table - conversation sessions
 * Each thread contains multiple messages
 */
export const threads = pgTable('threads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  // Title auto-generated from first message or user-provided
  title: text('title').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('threads_user_id_idx').on(table.userId),
}));

/**
 * Messages table - individual chat messages
 * Stores both user prompts and AI responses
 */
export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  threadId: text('thread_id')
    .notNull()
    .references(() => threads.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  // Metadata: { citations: [...], artifacts: [...], streaming_complete: boolean }
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  threadIdIdx: index('messages_thread_id_idx').on(table.threadId),
}));

/**
 * Documents table - source materials
 * Tracks PubMed articles, arXiv papers, and user uploads
 */
export const documents = pgTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sourceType: sourceTypeEnum('source_type').notNull(),
  // External IDs: PMID, PMC ID, arXiv ID, or null for uploads
  externalId: text('external_id'),
  // Document metadata
  title: text('title').notNull(),
  authors: text('authors'), // JSON array or comma-separated
  year: integer('year'),
  abstract: text('abstract'),
  doi: text('doi'),
  url: text('url'),
  // File storage
  filePath: text('file_path'), // Path in MinIO
  fileType: text('file_type'), // pdf, txt, md
  // Licensing and permissions
  license: text('license'), // open-access, restricted, etc.
  canRedistribute: boolean('can_redistribute').default(false),
  // Processing status
  embeddingStatus: embeddingStatusEnum('embedding_status').default('pending'),
  // If uploaded by user, track which thread
  uploadedByUserId: text('uploaded_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  uploadedInThreadId: text('uploaded_in_thread_id').references(() => threads.id, { onDelete: 'set null' }),
  // Metadata for chunking/embedding
  metadata: jsonb('metadata'), // { chunk_count, embedding_model, etc. }
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  externalIdIdx: index('documents_external_id_idx').on(table.externalId),
  sourceTypeIdx: index('documents_source_type_idx').on(table.sourceType),
  embeddingStatusIdx: index('documents_embedding_status_idx').on(table.embeddingStatus),
}));

/**
 * Message Citations - junction table linking messages to source documents
 */
export const messageCitations = pgTable('message_citations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  messageId: text('message_id')
    .notNull()
    .references(() => messages.id, { onDelete: 'cascade' }),
  documentId: text('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  // Relevance score from retrieval
  relevanceScore: integer('relevance_score'),
  // Which chunk was cited
  chunkIndex: integer('chunk_index'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  messageIdIdx: index('message_citations_message_id_idx').on(table.messageId),
  documentIdIdx: index('message_citations_document_id_idx').on(table.documentId),
}));

/**
 * Jobs table - background task tracking
 * Used for ingestion, PDF generation, embeddings, etc.
 */
export const jobs = pgTable('jobs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: jobTypeEnum('type').notNull(),
  status: jobStatusEnum('status').default('pending').notNull(),
  // Input parameters as JSON
  payload: jsonb('payload'),
  // Output/results as JSON (file paths, stats, etc.)
  result: jsonb('result'),
  // Error message if failed
  error: text('error'),
  // Progress tracking (0-100)
  progress: integer('progress').default(0),
  // Optional: link to user who triggered job
  triggeredByUserId: text('triggered_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  startedAt: timestamp('started_at', { mode: 'date' }),
  completedAt: timestamp('completed_at', { mode: 'date' }),
}, (table) => ({
  statusIdx: index('jobs_status_idx').on(table.status),
  typeIdx: index('jobs_type_idx').on(table.type),
}));

// ===========================
// RELATIONS (for Drizzle queries)
// ===========================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  threads: many(threads),
  uploadedDocuments: many(documents),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  user: one(users, {
    fields: [threads.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.id],
  }),
  citations: many(messageCitations),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [documents.uploadedByUserId],
    references: [users.id],
  }),
  uploadedInThread: one(threads, {
    fields: [documents.uploadedInThreadId],
    references: [threads.id],
  }),
  citations: many(messageCitations),
}));

export const messageCitationsRelations = relations(messageCitations, ({ one }) => ({
  message: one(messages, {
    fields: [messageCitations.messageId],
    references: [messages.id],
  }),
  document: one(documents, {
    fields: [messageCitations.documentId],
    references: [documents.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  triggeredBy: one(users, {
    fields: [jobs.triggeredByUserId],
    references: [users.id],
  }),
}));

// ===========================
// TYPE EXPORTS (for TypeScript)
// ===========================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Thread = typeof threads.$inferSelect;
export type NewThread = typeof threads.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type MessageCitation = typeof messageCitations.$inferSelect;
export type NewMessageCitation = typeof messageCitations.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

