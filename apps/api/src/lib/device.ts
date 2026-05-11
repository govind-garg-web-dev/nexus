import { createHash } from "crypto";
import type { FastifyRequest } from "fastify";

export function deriveDeviceHash(req: FastifyRequest): string {
  const components = [
    req.headers["user-agent"] ?? "",
    req.headers["accept-language"] ?? "",
    req.headers["accept-encoding"] ?? "",
    req.ip,
  ].join("|");
  return createHash("sha256").update(components).digest("hex");
}

export function hashPhone(phone: string): string {
  const normalized = phone.replace(/\D/g, "");
  return createHash("sha256").update(normalized).digest("hex");
}
