module.exports = [
"[project]/.next-internal/server/app/api/chat/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/database/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accounts",
    ()=>accounts,
    "accountsRelations",
    ()=>accountsRelations,
    "documents",
    ()=>documents,
    "documentsRelations",
    ()=>documentsRelations,
    "embeddingStatusEnum",
    ()=>embeddingStatusEnum,
    "jobStatusEnum",
    ()=>jobStatusEnum,
    "jobTypeEnum",
    ()=>jobTypeEnum,
    "jobs",
    ()=>jobs,
    "jobsRelations",
    ()=>jobsRelations,
    "messageCitations",
    ()=>messageCitations,
    "messageCitationsRelations",
    ()=>messageCitationsRelations,
    "messages",
    ()=>messages,
    "messagesRelations",
    ()=>messagesRelations,
    "roleEnum",
    ()=>roleEnum,
    "sessions",
    ()=>sessions,
    "sessionsRelations",
    ()=>sessionsRelations,
    "sourceTypeEnum",
    ()=>sourceTypeEnum,
    "threads",
    ()=>threads,
    "threadsRelations",
    ()=>threadsRelations,
    "users",
    ()=>users,
    "usersRelations",
    ()=>usersRelations,
    "verificationTokens",
    ()=>verificationTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/jsonb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/enum.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/indexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$primary$2d$keys$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/primary-keys.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/relations.js [app-route] (ecmascript)");
;
;
const roleEnum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgEnum"])('role', [
    'user',
    'assistant',
    'system'
]);
const sourceTypeEnum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgEnum"])('source_type', [
    'pubmed',
    'arxiv',
    'upload'
]);
const jobStatusEnum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgEnum"])('job_status', [
    'pending',
    'processing',
    'completed',
    'failed'
]);
const jobTypeEnum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgEnum"])('job_type', [
    'ingestion',
    'pdf_generation',
    'embedding',
    'artifact_creation'
]);
const embeddingStatusEnum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgEnum"])('embedding_status', [
    'pending',
    'processing',
    'completed',
    'failed'
]);
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('users', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey().$defaultFn(()=>crypto.randomUUID()),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('name'),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('email').unique(),
    emailVerified: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('emailVerified', {
        mode: 'date'
    }),
    image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('image'),
    // Password hash only for email/password users (null for OAuth-only)
    passwordHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('password_hash'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        mode: 'date'
    }).defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at', {
        mode: 'date'
    }).defaultNow().notNull()
});
const accounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('accounts', {
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('userId').notNull().references(()=>users.id, {
        onDelete: 'cascade'
    }),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('type').$type().notNull(),
    provider: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('provider').notNull(),
    providerAccountId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('providerAccountId').notNull(),
    refresh_token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('refresh_token'),
    access_token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('access_token'),
    expires_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('expires_at'),
    token_type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('token_type'),
    scope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('scope'),
    id_token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id_token'),
    session_state: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('session_state')
}, (account)=>({
        compoundKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$primary$2d$keys$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["primaryKey"])({
            columns: [
                account.provider,
                account.providerAccountId
            ]
        })
    }));
const sessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('sessions', {
    sessionToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('sessionToken').primaryKey(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('userId').notNull().references(()=>users.id, {
        onDelete: 'cascade'
    }),
    expires: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('expires', {
        mode: 'date'
    }).notNull()
});
const verificationTokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('verificationToken', {
    identifier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('identifier').notNull(),
    token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('token').notNull(),
    expires: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('expires', {
        mode: 'date'
    }).notNull()
}, (vt)=>({
        compoundKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$primary$2d$keys$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["primaryKey"])({
            columns: [
                vt.identifier,
                vt.token
            ]
        })
    }));
const threads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('threads', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey().$defaultFn(()=>crypto.randomUUID()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>users.id, {
        onDelete: 'cascade'
    }),
    // Title auto-generated from first message or user-provided
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('title').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        mode: 'date'
    }).defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at', {
        mode: 'date'
    }).defaultNow().notNull()
}, (table)=>({
        userIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('threads_user_id_idx').on(table.userId)
    }));
const messages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('messages', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey().$defaultFn(()=>crypto.randomUUID()),
    threadId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('thread_id').notNull().references(()=>threads.id, {
        onDelete: 'cascade'
    }),
    role: roleEnum('role').notNull(),
    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('content').notNull(),
    // Metadata: { citations: [...], artifacts: [...], streaming_complete: boolean }
    metadata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])('metadata'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        mode: 'date'
    }).defaultNow().notNull()
}, (table)=>({
        threadIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('messages_thread_id_idx').on(table.threadId)
    }));
const documents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('documents', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey().$defaultFn(()=>crypto.randomUUID()),
    sourceType: sourceTypeEnum('source_type').notNull(),
    // External IDs: PMID, PMC ID, arXiv ID, or null for uploads
    externalId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('external_id'),
    // Document metadata
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('title').notNull(),
    authors: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('authors'),
    year: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('year'),
    abstract: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('abstract'),
    doi: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('doi'),
    url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('url'),
    // File storage
    filePath: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('file_path'),
    fileType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('file_type'),
    // Licensing and permissions
    license: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('license'),
    canRedistribute: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])('can_redistribute').default(false),
    // Processing status
    embeddingStatus: embeddingStatusEnum('embedding_status').default('pending'),
    // If uploaded by user, track which thread
    uploadedByUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('uploaded_by_user_id').references(()=>users.id, {
        onDelete: 'set null'
    }),
    uploadedInThreadId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('uploaded_in_thread_id').references(()=>threads.id, {
        onDelete: 'set null'
    }),
    // Metadata for chunking/embedding
    metadata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])('metadata'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        mode: 'date'
    }).defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at', {
        mode: 'date'
    }).defaultNow().notNull()
}, (table)=>({
        externalIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('documents_external_id_idx').on(table.externalId),
        sourceTypeIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('documents_source_type_idx').on(table.sourceType),
        embeddingStatusIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('documents_embedding_status_idx').on(table.embeddingStatus)
    }));
const messageCitations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('message_citations', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey().$defaultFn(()=>crypto.randomUUID()),
    messageId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('message_id').notNull().references(()=>messages.id, {
        onDelete: 'cascade'
    }),
    documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('document_id').notNull().references(()=>documents.id, {
        onDelete: 'cascade'
    }),
    // Relevance score from retrieval
    relevanceScore: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('relevance_score'),
    // Which chunk was cited
    chunkIndex: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('chunk_index'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        mode: 'date'
    }).defaultNow().notNull()
}, (table)=>({
        messageIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('message_citations_message_id_idx').on(table.messageId),
        documentIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('message_citations_document_id_idx').on(table.documentId)
    }));
const jobs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('jobs', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey().$defaultFn(()=>crypto.randomUUID()),
    type: jobTypeEnum('type').notNull(),
    status: jobStatusEnum('status').default('pending').notNull(),
    // Input parameters as JSON
    payload: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])('payload'),
    // Output/results as JSON (file paths, stats, etc.)
    result: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])('result'),
    // Error message if failed
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('error'),
    // Progress tracking (0-100)
    progress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('progress').default(0),
    // Optional: link to user who triggered job
    triggeredByUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('triggered_by_user_id').references(()=>users.id, {
        onDelete: 'set null'
    }),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        mode: 'date'
    }).defaultNow().notNull(),
    startedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('started_at', {
        mode: 'date'
    }),
    completedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('completed_at', {
        mode: 'date'
    })
}, (table)=>({
        statusIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('jobs_status_idx').on(table.status),
        typeIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('jobs_type_idx').on(table.type)
    }));
const usersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(users, ({ many })=>({
        accounts: many(accounts),
        sessions: many(sessions),
        threads: many(threads),
        uploadedDocuments: many(documents)
    }));
const accountsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(accounts, ({ one })=>({
        user: one(users, {
            fields: [
                accounts.userId
            ],
            references: [
                users.id
            ]
        })
    }));
const sessionsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(sessions, ({ one })=>({
        user: one(users, {
            fields: [
                sessions.userId
            ],
            references: [
                users.id
            ]
        })
    }));
const threadsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(threads, ({ one, many })=>({
        user: one(users, {
            fields: [
                threads.userId
            ],
            references: [
                users.id
            ]
        }),
        messages: many(messages)
    }));
const messagesRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(messages, ({ one, many })=>({
        thread: one(threads, {
            fields: [
                messages.threadId
            ],
            references: [
                threads.id
            ]
        }),
        citations: many(messageCitations)
    }));
const documentsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(documents, ({ one, many })=>({
        uploadedBy: one(users, {
            fields: [
                documents.uploadedByUserId
            ],
            references: [
                users.id
            ]
        }),
        uploadedInThread: one(threads, {
            fields: [
                documents.uploadedInThreadId
            ],
            references: [
                threads.id
            ]
        }),
        citations: many(messageCitations)
    }));
const messageCitationsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(messageCitations, ({ one })=>({
        message: one(messages, {
            fields: [
                messageCitations.messageId
            ],
            references: [
                messages.id
            ]
        }),
        document: one(documents, {
            fields: [
                messageCitations.documentId
            ],
            references: [
                documents.id
            ]
        })
    }));
const jobsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(jobs, ({ one })=>({
        triggeredBy: one(users, {
            fields: [
                jobs.triggeredByUserId
            ],
            references: [
                users.id
            ]
        })
    }));
}),
"[project]/app/database/db-server.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/neon-http/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/database/schema.ts [app-route] (ecmascript)");
;
;
;
// Initialize Neon serverless connection
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])({
    client: sql,
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
;
}),
"[project]/app/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/google.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/google.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$drizzle$2d$adapter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/drizzle-adapter/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/database/db-server.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/database/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
const { handlers, signIn, signOut, auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    adapter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$drizzle$2d$adapter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DrizzleAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"], {
        usersTable: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"],
        accountsTable: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["accounts"],
        sessionsTable: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessions"],
        verificationTokensTable: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verificationTokens"]
    }),
    trustHost: true,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },
    providers: [
        // Google OAuth Provider
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        // Email/Password Credentials Provider
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
                // Find user by email
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].email, credentials.email)).limit(1);
                if (!user || user.length === 0) {
                    throw new Error("No user found with this email");
                }
                const dbUser = user[0];
                // Check if user has a password (not OAuth-only)
                if (!dbUser.passwordHash) {
                    throw new Error("Please sign in with Google");
                }
                // Verify password
                const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, dbUser.passwordHash);
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }
                // Return user object (will be encoded in JWT)
                return {
                    id: dbUser.id,
                    email: dbUser.email,
                    name: dbUser.name,
                    image: dbUser.image
                };
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
            // Add user ID to token on sign in
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session ({ session, token }) {
            // Add user ID to session
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        }
    }
});
}),
"[project]/app/lib/gemini.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "model",
    ()=>model
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp'
});
const __TURBOPACK__default__export__ = genAI;
}),
"[project]/app/lib/pdf-processor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chunkText",
    ()=>chunkText,
    "cosineSimilarity",
    ()=>cosineSimilarity,
    "extractTextFromPDF",
    ()=>extractTextFromPDF,
    "findRelevantChunks",
    ()=>findRelevantChunks,
    "generateEmbedding",
    ()=>generateEmbedding,
    "processPDF",
    ()=>processPDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$azure$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/openai/azure.mjs [app-route] (ecmascript)");
;
// Initialize Azure OpenAI for embeddings (reuse existing credentials)
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$azure$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AzureOpenAI"]({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION,
    deployment: 'text-embedding-ada-002'
});
async function extractTextFromPDF(buffer) {
    try {
        // Use pdf-parse-fork which is a working maintained fork
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfParse = (await __turbopack_context__.A("[project]/node_modules/pdf-parse-fork/index.js [app-route] (ecmascript, async loader)")).default;
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
function chunkText(text, maxWordsPerChunk = 500) {
    // Split by double newlines (paragraphs)
    const paragraphs = text.split(/\n\n+/).filter((p)=>p.trim().length > 0);
    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    for (const paragraph of paragraphs){
        const words = paragraph.split(/\s+/);
        const wordCount = words.length;
        if (currentWordCount + wordCount > maxWordsPerChunk && currentChunk.length > 0) {
            // Start a new chunk
            chunks.push(currentChunk.join('\n\n'));
            currentChunk = [
                paragraph
            ];
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
async function generateEmbedding(text) {
    try {
        // Try to use Azure OpenAI embeddings if available
        try {
            const response = await openai.embeddings.create({
                model: 'text-embedding-ada-002',
                input: text
            });
            console.log('✓ Generated Azure OpenAI embedding');
            return response.data[0].embedding;
        } catch  {
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
 */ function createSimpleEmbedding(text) {
    const dimension = 384; // Match sentence-transformers dimension
    const embedding = new Array(dimension).fill(0);
    // Simple hash-based approach
    for(let i = 0; i < text.length; i++){
        const charCode = text.charCodeAt(i);
        const index = (charCode + i) % dimension;
        embedding[index] += charCode / 1000;
    }
    // Normalize to unit vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val)=>sum + val * val, 0));
    return embedding.map((val)=>val / (magnitude || 1));
}
async function processPDF(buffer) {
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
    const chunks = [];
    for(let i = 0; i < textChunks.length; i++){
        const embedding = await generateEmbedding(textChunks[i]);
        chunks.push({
            text: textChunks[i],
            embedding,
            index: i
        });
    }
    console.log(`✓ Generated embeddings for ${chunks.length} chunks`);
    return chunks;
}
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for(let i = 0; i < vecA.length; i++){
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
async function findRelevantChunks(query, chunks, topK = 3) {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    // Calculate similarity scores
    const chunksWithScores = chunks.map((chunk)=>({
            chunk,
            score: cosineSimilarity(queryEmbedding, chunk.embedding)
        }));
    // Sort by score and return top K
    chunksWithScores.sort((a, b)=>b.score - a.score);
    return chunksWithScores.slice(0, topK).map((item)=>item.chunk);
}
}),
"[project]/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/database/db-server.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/database/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$pdf$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/pdf-processor.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const runtime = 'nodejs';
const dynamic = 'force-dynamic';
async function POST(req) {
    try {
        // Verify authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session?.user?.id) {
            return new Response('Unauthorized', {
                status: 401
            });
        }
        const body = await req.json();
        const { message, threadId } = body;
        if (!message || typeof message !== 'string') {
            return new Response('Invalid message', {
                status: 400
            });
        }
        let currentThreadId = threadId;
        // Create new thread if not provided
        if (!currentThreadId) {
            const [newThread] = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["threads"]).values({
                userId: session.user.id,
                title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
            }).returning();
            currentThreadId = newThread.id;
        } else {
            // Verify thread belongs to user
            const [thread] = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["threads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["threads"].id, currentThreadId)).limit(1);
            if (!thread || thread.userId !== session.user.id) {
                return new Response('Thread not found', {
                    status: 404
                });
            }
        }
        // Save user message
        await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messages"]).values({
            threadId: currentThreadId,
            role: 'user',
            content: message
        });
        // Fetch conversation history for context
        const conversationHistory = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messages"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messages"].threadId, currentThreadId)).orderBy(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messages"].createdAt);
        // Fetch uploaded documents for this user (not just this thread)
        // This allows users to upload documents once and use them across conversations
        const uploadedDocs = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["documents"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["documents"].uploadedByUserId, session.user.id));
        // Retrieve relevant context from uploaded documents
        let contextFromDocuments = '';
        if (uploadedDocs.length > 0) {
            // Collect all chunks from all documents
            const allChunks = [];
            uploadedDocs.forEach((doc)=>{
                if (doc.metadata && typeof doc.metadata === 'object' && 'chunks' in doc.metadata) {
                    const docChunks = doc.metadata.chunks || [];
                    allChunks.push(...docChunks);
                }
            });
            if (allChunks.length > 0) {
                // Find relevant chunks for the current user message
                const relevantChunks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$pdf$2d$processor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findRelevantChunks"])(message, allChunks, 3);
                if (relevantChunks.length > 0) {
                    contextFromDocuments = '\n\nRelevant excerpts from uploaded documents:\n\n' + relevantChunks.map((chunk, idx)=>`[Excerpt ${idx + 1}]:\n${chunk.text}\n`).join('\n');
                }
            }
        }
        // Prepare prompt for Gemini
        const systemPrompt = uploadedDocs.length > 0 ? `You are a research assistant specialized in analyzing academic papers. Follow these guidelines:

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

4. CITATIONS: When referencing information, mention which excerpt it comes from (e.g., "According to Excerpt 1...")

5. FORMATTING EXAMPLE:
## Main Topic

Brief introduction.

**Key Point**: Important detail here.

- First item
- Second item
- Third item

## Next Section

More information here.

Answer the user's question based on the provided research paper excerpts.` : `You are a research assistant for scientific papers. Follow these guidelines:

1. ACCURACY: Provide factual, well-researched information about scientific topics.
2. CONCISENESS: Be direct and avoid unnecessary verbosity.
3. STRUCTURE: Use clear Markdown formatting with headings, lists, and emphasis.
4. CLARITY: Explain complex concepts in accessible language.

Provide accurate, well-formatted responses to research questions.`;
        // Build conversation history for Gemini
        const geminiHistory = conversationHistory.slice(0, -1).map((msg)=>({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [
                    {
                        text: msg.content
                    }
                ]
            }));
        // Get the current user message with context
        const currentMessage = message + (contextFromDocuments || '');
        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start (controller) {
                try {
                    // Start Gemini chat with history (include system prompt in first message of history)
                    const chatHistory = geminiHistory.length === 0 ? [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: systemPrompt
                                }
                            ]
                        },
                        {
                            role: 'model',
                            parts: [
                                {
                                    text: 'Understood. I will follow these guidelines when analyzing research papers and answering questions.'
                                }
                            ]
                        }
                    ] : geminiHistory;
                    const chat = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["model"].startChat({
                        history: chatHistory,
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 2000,
                            topP: 0.8,
                            topK: 40
                        }
                    });
                    // Stream the response
                    const result = await chat.sendMessageStream(currentMessage);
                    let fullResponse = '';
                    // Stream the response
                    for await (const chunk of result.stream){
                        const content = chunk.text();
                        if (content) {
                            fullResponse += content;
                            // Send SSE format
                            const data = JSON.stringify({
                                content,
                                threadId: currentThreadId,
                                done: false
                            });
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                        }
                    }
                    // Save assistant response to database
                    await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$db$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$database$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messages"]).values({
                        threadId: currentThreadId,
                        role: 'assistant',
                        content: fullResponse,
                        metadata: {
                            streaming_complete: true,
                            model: 'gemini-2.0-flash-exp'
                        }
                    });
                    // Send final message
                    const finalData = JSON.stringify({
                        content: '',
                        threadId: currentThreadId,
                        done: true
                    });
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                    controller.close();
                } catch (error) {
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
                        done: true
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                    controller.close();
                }
            }
        });
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response('Internal server error', {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__be491d72._.js.map