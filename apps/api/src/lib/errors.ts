import { createError } from "@fastify/error";

export const UnauthorizedError = createError(
  "UNAUTHORIZED",
  "Authentication required",
  401,
);

export const ForbiddenError = createError(
  "FORBIDDEN",
  "You do not have permission to perform this action",
  403,
);

export const NotFoundError = createError(
  "NOT_FOUND",
  "%s not found",
  404,
);

export const ConflictError = createError(
  "CONFLICT",
  "%s already exists",
  409,
);

export const ValidationError = createError(
  "VALIDATION_ERROR",
  "%s",
  400,
);

export const DomainBlockedError = createError(
  "DOMAIN_BLOCKED",
  "This email domain is not allowed. Please use your college institutional email.",
  400,
);
