import type { FastifyInstance } from "fastify";

export async function profileRoutes(app: FastifyInstance) {
  // GET  /api/profiles/me
  // PUT  /api/profiles/me
  // GET  /api/profiles/:userId  (anonymized)

  app.get("/ping", async () => ({ route: "profiles", status: "stub" }));
}
