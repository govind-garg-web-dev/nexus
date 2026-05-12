// Clients
export { db, publicDb, behavioralDb } from "./client";
export type { Database, PublicDatabase, BehavioralDatabase } from "./client";

// Schemas
export * as identitySchema from "./schema/identity";
export * as publicSchema from "./schema/public";
export * as behavioralSchema from "./schema/behavioral";
