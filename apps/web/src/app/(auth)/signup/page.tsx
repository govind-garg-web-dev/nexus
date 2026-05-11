"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { auth, ApiRequestError } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

type Step = "details" | "verify";

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

const hintStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#52525b",
  marginTop: "5px",
};

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [realName, setRealName] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [smsCode, setSmsCode] = useState("");

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.requestSignupOtp(email, phone);
      toast.success("OTP sent to your email and phone.");
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
      await auth.verifySignupOtp({ email, phone, emailCode, smsCode, realName });
      const me = await auth.me();
      setAuth(me.userId, me.collegeId);
      toast.success("Account created!");
      router.push("/setup-profile");
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

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>

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
            Anonymous merit-based campus network
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
                  background: step === "details" ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "rgba(139,92,246,0.2)",
                  border: step === "details" ? "none" : "1px solid rgba(139,92,246,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: step === "details" ? "#fff" : "#8b5cf6",
                }}
              >
                {step === "verify" ? "✓" : "1"}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 500, color: step === "details" ? "#fafafa" : "#71717a" }}>
                Your details
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
                Verify OTPs
              </span>
            </div>
          </div>

          {step === "details" ? (
            <form onSubmit={handleRequestOtp} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle} htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Aarav Sharma"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  required
                  minLength={2}
                  style={inputStyle}
                />
                <p style={hintStyle}>Only revealed after a mutual match. Never shown publicly.</p>
              </div>

              <div>
                <label style={labelStyle} htmlFor="email">College email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@college.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
                <p style={hintStyle}>Gmail and personal emails are not accepted.</p>
              </div>

              <div>
                <label style={labelStyle} htmlFor="phone">Mobile number</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)",
                      fontSize: "14px",
                      color: "#71717a",
                      flexShrink: 0,
                    }}
                  >
                    +91
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    maxLength={10}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
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
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                }}
              >
                {loading ? "Sending OTPs…" : "Send verification codes →"}
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
                OTPs sent to <strong>{email}</strong> and your phone.
              </div>

              <div>
                <label style={labelStyle} htmlFor="emailCode">Email OTP</label>
                <input
                  id="emailCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="· · · · · ·"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  required
                  style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center", fontSize: "20px", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="smsCode">SMS OTP</label>
                <input
                  id="smsCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="· · · · · ·"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  required
                  style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center", fontSize: "20px", fontWeight: 700 }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || emailCode.length < 6 || smsCode.length < 6}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    loading || emailCode.length < 6 || smsCode.length < 6
                      ? "rgba(139,92,246,0.3)"
                      : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: loading || emailCode.length < 6 || smsCode.length < 6 ? "not-allowed" : "pointer",
                  boxShadow:
                    loading || emailCode.length < 6 || smsCode.length < 6
                      ? "none"
                      : "0 0 24px rgba(139,92,246,0.4)",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Creating account…" : "Create account →"}
              </button>

              <button
                type="button"
                onClick={() => setStep("details")}
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
                ← Back
              </button>
            </form>
          )}
        </div>

        {/* Footer link */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#52525b", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 500 }}>
            Log in
          </Link>
        </p>

        {/* Trust signals */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
          {["🔒 Anonymous until match", "✓ Free forever", "🏫 Campus-verified only"].map((t) => (
            <span key={t} style={{ fontSize: "11px", color: "#3f3f46" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
