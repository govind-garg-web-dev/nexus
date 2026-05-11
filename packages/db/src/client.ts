import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as identitySchema from "./schema/identity.js";
import * as publicSchema from "./schema/public.js";
import * as behavioralSchema from "./schema/behavioral.js";

/**
 * Lazy DB client factory.
 *
 * Why lazy: In ESM, all module-level code runs during import graph resolution,
 * BEFORE the entry point dotenv config populates process.env.
 * Deferred initialization means DATABASE_URL is checked only on first DB call,
 * at which point the env is fully loaded.
 */

function getUrl(): string {
  const url = process.env["DATABASE_URL"];
  if (!url) throw new Error("DATABASE_URL environment variable is not set.");
  return url;
}

function createFullDb() {
  return drizzle(neon(getUrl()), {
    schema: { ...identitySchema, ...publicSchema, ...behavioralSchema },
  });
}

function createPublicDb() {
  return drizzle(neon(getUrl()), { schema: { ...publicSchema } });
}

function createBehavioralDb() {
  return drizzle(neon(getUrl()), { schema: { ...behavioralSchema } });
}

type FullDb = ReturnType<typeof createFullDb>;
type PublicDb = ReturnType<typeof createPublicDb>;
type BehavioralDb = ReturnType<typeof createBehavioralDb>;

let _db: FullDb | null = null;
let _publicDb: PublicDb | null = null;
let _behavioralDb: BehavioralDb | null = null;

export const db = new Proxy({} as FullDb, {
  get(_target, prop) {
    if (!_db) _db = createFullDb();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const publicDb = new Proxy({} as PublicDb, {
  get(_target, prop) {
    if (!_publicDb) _publicDb = createPublicDb();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (_publicDb as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const behavioralDb = new Proxy({} as BehavioralDb, {
  get(_target, prop) {
    if (!_behavioralDb) _behavioralDb = createBehavioralDb();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (_behavioralDb as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type { FullDb as Database, PublicDb as PublicDatabase, BehavioralDb as BehavioralDatabase };
