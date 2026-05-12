import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as identitySchema from "./schema/identity.js";
import * as publicSchema from "./schema/public.js";
import * as behavioralSchema from "./schema/behavioral.js";

/**
 * Lazy DB client — deferred so dotenv loads before DATABASE_URL is read.
 * Uses postgres.js which works with Supabase + Vercel serverless.
 */

function getUrl(): string {
  const url = process.env["DATABASE_URL"];
  if (!url) throw new Error("DATABASE_URL environment variable is not set.");
  return url;
}

// For serverless (Vercel), max 1 connection per function instance
function makeClient(options?: { max?: number }) {
  return postgres(getUrl(), {
    max: options?.max ?? 1,
    ssl: "require",
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

function createFullDb() {
  return drizzle(makeClient(), {
    schema: { ...identitySchema, ...publicSchema, ...behavioralSchema },
  });
}
function createPublicDb() {
  return drizzle(makeClient(), { schema: { ...publicSchema } });
}
function createBehavioralDb() {
  return drizzle(makeClient(), { schema: { ...behavioralSchema } });
}

type FullDb = ReturnType<typeof createFullDb>;
type PublicDb = ReturnType<typeof createPublicDb>;
type BehavioralDb = ReturnType<typeof createBehavioralDb>;

let _db: FullDb | null = null;
let _publicDb: PublicDb | null = null;
let _behavioralDb: BehavioralDb | null = null;

export const db = new Proxy({} as FullDb, {
  get(_t, prop) {
    if (!_db) _db = createFullDb();
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const publicDb = new Proxy({} as PublicDb, {
  get(_t, prop) {
    if (!_publicDb) _publicDb = createPublicDb();
    return (_publicDb as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const behavioralDb = new Proxy({} as BehavioralDb, {
  get(_t, prop) {
    if (!_behavioralDb) _behavioralDb = createBehavioralDb();
    return (_behavioralDb as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type {
  FullDb as Database,
  PublicDb as PublicDatabase,
  BehavioralDb as BehavioralDatabase,
};
