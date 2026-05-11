// Clients
export { db, publicDb, behavioralDb } from "./client.js";
export type { Database, PublicDatabase, BehavioralDatabase } from "./client.js";

// Schemas — exported for use in services. Import the right one.
export * as identitySchema from "./schema/identity.js";
export * as publicSchema from "./schema/public.js";
export * as behavioralSchema from "./schema/behavioral.js";
