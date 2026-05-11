import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getSessionUser } from "../services/auth.service.js";

declare module "fastify" {
  interface FastifyRequest {
    user: { userId: string; collegeId: string } | null;
  }
}

export const authPlugin = fp(async (app: FastifyInstance) => {
  app.decorateRequest("user", null);

  app.addHook("preHandler", async (req: FastifyRequest) => {
    const token = req.cookies["nexus_session"];
    if (!token) return;
    const user = await getSessionUser(token);
    if (user) req.user = user;
  });
});

export function requireAuth(
  req: FastifyRequest,
  reply: FastifyReply,
): { userId: string; collegeId: string } {
  if (!req.user) {
    void reply.status(401).send({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required." },
    });
    throw new Error("UNAUTHORIZED");
  }
  return req.user;
}
