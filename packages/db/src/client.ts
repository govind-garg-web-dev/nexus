import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as identitySchema from "./schema/identity.js";
import * as publicSchema from "./schema/public.js";
import * as behavioralSchema from "./schema/behavioral.js";

if (!process.env["DATABASE_URL"]) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env["DATABASE_URL"]);

/**
 * Full database client — only for use in trusted internal services.
 * Application routes should use the scoped clients below.
 */
export const db = drizzle(sql, {
  schema: {
    ...identitySchema,
    ...publicSchema,
    ...behavioralSchema,
  },
});

/**
 * Public-schema-only client.
 * Safe to use in all Fastify route handlers.
 */
export const publicDb = drizzle(sql, {
  schema: { ...publicSchema },
});

/**
 * Behavioral-schema-only client.
 * Use ONLY in background scoring jobs and internal microservices.
 */
export const behavioralDb = drizzle(sql, {
  schema: { ...behavioralSchema },
});

export type Database = typeof db;
export type PublicDatabase = typeof publicDb;
export type BehavioralDatabase = typeof behavioralDb;
