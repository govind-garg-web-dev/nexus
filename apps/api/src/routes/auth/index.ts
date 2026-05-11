import type { FastifyInstance } from "fastify";

export async function authRoutes(app: FastifyInstance) {
  // POST /api/auth/signup/request-otp
  // POST /api/auth/signup/verify-otp
  // POST /api/auth/login/request-otp
  // POST /api/auth/login/verify-otp
  // POST /api/auth/logout
  // GET  /api/auth/me

  app.get("/ping", async () => ({ route: "auth", status: "stub" }));
}
