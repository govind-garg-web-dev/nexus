"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { auth, ApiRequestError } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

type Step = "email" | "verify";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "#fafafa",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.15s",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#a1a1aa",
  marginBottom: "6px",
  display: "block",
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.requestLoginOtp(email);
      toast.success("Check your inbox for a verification code.");
      setStep("verify");
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.verifyLoginOtp(email, code);
      const me = await auth.me();
      setAuth(me.userId, me.collegeId);
      setProfileComplete(result.isProfileComplete);
      router.push(result.nextStep === "feed" ? "/feed" : "/setup-profile");
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "400px", position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #8b5cf6, #c084fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                boxShadow: "0 0 30px rgba(139,92,246,0.4)",
              }}
            >
              ⬡
            </div>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#fafafa", letterSpacing: "-0.03em" }}>Nexus</span>
          </Link>
          <p style={{ fontSize: "13px", color: "#52525b", marginTop: "6px" }}>
            {step === "email" ? "Welcome back" : `Code sent to ${email}`}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "28px",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: step === "email" ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "rgba(139,92,246,0.2)",
                  border: step === "email" ? "none" : "1px solid rgba(139,92,246,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {step === "verify" ? "✓" : "1"}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 500, color: step === "email" ? "#fafafa" : "#71717a" }}>
                Enter email
              </span>
            </div>

            <div style={{ flex: 1, height: "1px", background: step === "verify" ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: step === "verify" ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "rgba(255,255,255,0.04)",
                  border: step === "verify" ? "none" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: step === "verify" ? "#fff" : "#52525b",
                }}
              >
                2
              </div>
              <span style={{ fontSize: "12px", fontWeight: 500, color: step === "verify" ? "#fafafa" : "#52525b" }}>
                Enter OTP
              </span>
            </div>
          </div>

          {step === "email" ? (
            <form onSubmit={handleRequestOtp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle} htmlFor="email">College email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@college.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 0 24px rgba(139,92,246,0.4)",
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                }}
              >
                {loading ? "Sending…" : "Send OTP →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  fontSize: "13px",
                  color: "#a78bfa",
                }}
              >
                6-digit code sent to <strong>{email}</strong>
              </div>

              <div>
                <label style={labelStyle} htmlFor="code">Verification code</label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="· · · · · ·"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  required
                  autoFocus
                  style={{
                    ...inputStyle,
                    letterSpacing: "0.3em",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: 700,
                    padding: "16px 14px",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length < 6}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    loading || code.length < 6
                      ? "rgba(139,92,246,0.3)"
                      : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: loading || code.length < 6 ? "not-allowed" : "pointer",
                  boxShadow: loading || code.length < 6 ? "none" : "0 0 24px rgba(139,92,246,0.4)",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Logging in…" : "Log in →"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#52525b",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "4px",
                }}
              >
                ← Use a different email
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#52525b", marginTop: "20px" }}>
          New to Nexus?{" "}
          <Link href="/signup" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 500 }}>
            Create an account
          </Link>
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
          {["🔒 Anonymous until match", "✓ Free forever", "🏫 Campus-verified only"].map((t) => (
            <span key={t} style={{ fontSize: "11px", color: "#3f3f46" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
