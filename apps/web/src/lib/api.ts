/**
 * API client — calls Next.js Route Handlers at /api/...
 * Same origin as the frontend, so no CORS config needed.
 */

interface ApiResponse<T> { success: true; data: T }
interface ApiError { success: false; error: { code: string; message: string } }
type ApiResult<T> = ApiResponse<T> | ApiError;

export class ApiRequestError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = (await res.json()) as ApiResult<T>;
  if (!json.success) throw new ApiRequestError(json.error.code, json.error.message, res.status);
  return json.data;
}

export const auth = {
  requestSignupOtp: (email: string, phone: string) =>
    request<{ message: string }>("/api/auth/signup/request-otp", { method: "POST", body: JSON.stringify({ email, phone }) }),

  verifySignupOtp: (payload: { email: string; phone: string; emailCode: string; smsCode: string; realName: string }) =>
    request<{ userId: string; nextStep: string }>("/api/auth/signup/verify-otp", { method: "POST", body: JSON.stringify(payload) }),

  requestLoginOtp: (email: string) =>
    request<{ message: string }>("/api/auth/login/request-otp", { method: "POST", body: JSON.stringify({ email }) }),

  verifyLoginOtp: (email: string, code: string) =>
    request<{ userId: string; isProfileComplete: boolean; nextStep: string }>("/api/auth/login/verify-otp", { method: "POST", body: JSON.stringify({ email, code }) }),

  logout: () => request<{ message: string }>("/api/auth/logout", { method: "POST" }),

  me: () => request<{ userId: string; collegeId: string }>("/api/auth/me"),
};
