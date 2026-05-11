import type { FastifyInstance } from "fastify";

export async function matchingRoutes(app: FastifyInstance) {
  // GET  /api/matching/feed
  // POST /api/matching/like
  // GET  /api/matching/matches
  // POST /api/matching/:matchId/icebreaker/answer
  // GET  /api/matching/:matchId

  app.get("/ping", async () => ({ route: "matching", status: "stub" }));
}
