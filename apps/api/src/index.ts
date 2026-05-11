import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";

import { authRoutes } from "./routes/auth/index.js";
import { profileRoutes } from "./routes/profiles/index.js";
import { matchingRoutes } from "./routes/matching/index.js";
import { skillRoutes } from "./routes/skills/index.js";

const app = Fastify({
  logger: {
    level: process.env["LOG_LEVEL"] ?? "info",
    transport:
      process.env["NODE_ENV"] === "development"
        ? { target: "pino-pretty" }
        : undefined,
  },
});

// ─── Plugins ──────────────────────────────────────────────────────────────────

await app.register(helmet, {
  contentSecurityPolicy: false, // Handled by Next.js
});

await app.register(cors, {
  origin: process.env["WEB_URL"] ?? "http://localhost:3000",
  credentials: true,
});

await app.register(cookie, {
  secret: process.env["COOKIE_SECRET"] ?? "dev-secret-change-in-prod",
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
  // Auth endpoints get a stricter limit
  keyGenerator: (req) => req.ip,
});

// ─── Routes ───────────────────────────────────────────────────────────────────

await app.register(authRoutes, { prefix: "/api/auth" });
await app.register(profileRoutes, { prefix: "/api/profiles" });
await app.register(matchingRoutes, { prefix: "/api/matching" });
await app.register(skillRoutes, { prefix: "/api/skills" });

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

// ─── Error Handler ────────────────────────────────────────────────────────────

app.setErrorHandler((error, _req, reply) => {
  app.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: { code: "VALIDATION_ERROR", message: error.message },
    });
  }

  const statusCode = error.statusCode ?? 500;
  return reply.status(statusCode).send({
    success: false,
    error: {
      code: statusCode === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message:
        process.env["NODE_ENV"] === "production"
          ? "An error occurred"
          : error.message,
    },
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env["PORT"] ?? "4000", 10);

await app.listen({ port: PORT, host: "0.0.0.0" });
app.log.info(`API running on http://localhost:${PORT.toString()}`);
