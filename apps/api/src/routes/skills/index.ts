import type { FastifyInstance } from "fastify";

export async function skillRoutes(app: FastifyInstance) {
  // GET  /api/skills/challenges
  // POST /api/skills/challenges/:id/start
  // POST /api/skills/challenges/:id/submit
  // GET  /api/skills/badges/:userId

  app.get("/ping", async () => ({ route: "skills", status: "stub" }));
}
