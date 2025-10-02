import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Initialize Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle instance with schema for relational queries
export const db = drizzle({ client: sql, schema });

// Export schema for NextAuth adapter and type inference
export { schema };
