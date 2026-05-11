import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requestSignupOtp, verifySignupOtp, requestLoginOtp, verifyLoginOtp, revokeSession } from "../../services/auth.service.js";
import { requireAuth } from "../../plugins/auth.plugin.js";
import { deriveDeviceHash } from "../../lib/device.js";

const SESSION_COOKIE = "nexus_session";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

export async function authRoutes(app: FastifyInstance) {
  app.post("/signup/request-otp", async (req, reply) => {
    const body = z.object({ email: z.string().email(), phone: z.string().min(10).max(13) }).safeParse(req.body);
    if (!body.success) return reply.status(400).send({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } });
    try {
      const result = await requestSignupOtp(body.data.email, body.data.phone, deriveDeviceHash(req));
      return reply.status(200).send({ success: true, data: result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const [code, message] = msg.includes(":") ? msg.split(": ", 2) : ["ERROR", msg];
      const status = code === "DOMAIN_BLOCKED" || code === "INVALID_PHONE" ? 400 : code === "ALREADY_EXISTS" ? 409 : 500;
      return reply.status(status).send({ success: false, error: { code: code ?? "ERROR", message: message ?? msg } });
    }
  });

  app.post("/signup/verify-otp", async (req, reply) => {
    const body = z.object({
      email: z.string().email(), phone: z.string().min(10).max(13),
      emailCode: z.string().length(6), smsCode: z.string().length(6),
      realName: z.string().min(2).max(100),
    }).safeParse(req.body);
    if (!body.success) return reply.status(400).send({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } });
    try {
      const result = await verifySignupOtp(body.data.email, body.data.phone, body.data.emailCode, body.data.smsCode, body.data.realName, deriveDeviceHash(req));
      void reply.setCookie(SESSION_COOKIE, result.sessionToken, COOKIE_OPTS);
      return reply.status(201).send({ success: true, data: { userId: result.userId, nextStep: "setup-profile" } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const [code, message] = msg.includes(":") ? msg.split(": ", 2) : ["ERROR", msg];
      const status = code === "INVALID_OTP" ? 401 : code === "COLLEGE_NOT_FOUND" ? 404 : 500;
      return reply.status(status).send({ success: false, error: { code: code ?? "ERROR", message: message ?? msg } });
    }
  });

  app.post("/login/request-otp", async (req, reply) => {
    const body = z.object({ email: z.string().email() }).safeParse(req.body);
    if (!body.success) return reply.status(400).send({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } });
    const result = await requestLoginOtp(body.data.email);
    return reply.status(200).send({ success: true, data: result });
  });

  app.post("/login/verify-otp", async (req, reply) => {
    const body = z.object({ email: z.string().email(), code: z.string().length(6) }).safeParse(req.body);
    if (!body.success) return reply.status(400).send({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } });
    try {
      const result = await verifyLoginOtp(body.data.email, body.data.code, deriveDeviceHash(req));
      void reply.setCookie(SESSION_COOKIE, result.sessionToken, COOKIE_OPTS);
      return reply.status(200).send({ success: true, data: { userId: result.userId, isProfileComplete: result.isProfileComplete, nextStep: result.isProfileComplete ? "feed" : "setup-profile" } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const [code, message] = msg.includes(":") ? msg.split(": ", 2) : ["ERROR", msg];
      const status = code === "INVALID_OTP" ? 401 : code === "SUSPENDED" ? 403 : 500;
      return reply.status(status).send({ success: false, error: { code: code ?? "ERROR", message: message ?? msg } });
    }
  });

  app.post("/logout", async (req, reply) => {
    const token = req.cookies[SESSION_COOKIE];
    if (token) await revokeSession(token);
    void reply.clearCookie(SESSION_COOKIE, { path: "/" });
    return reply.status(200).send({ success: true, data: { message: "Logged out." } });
  });

  app.get("/me", async (req, reply) => {
    const user = requireAuth(req, reply);
    return reply.status(200).send({ success: true, data: user });
  });
}
