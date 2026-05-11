import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexus — Find Your People on Campus",
  description:
    "Campus-verified, anonymous-first network for Indian college students. Find teammates, roommates, mentors, and study partners based on verified skills — not looks or social status.",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: "rgba(139,92,246,0.12)",
        border: "1px solid rgba(139,92,246,0.3)",
        color: "#a78bfa",
      }}
    >
      {children}
    </span>
  );
}

function ProblemCard({
  icon,
  title,
  problem,
  solution,
}: {
  icon: string;
  title: string;
  problem: string;
  solution: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ fontSize: "28px" }}>{icon}</div>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "#fafafa" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.65 }}>{problem}</div>
      <div
        style={{
          fontSize: "12px",
          color: "#a78bfa",
          lineHeight: 1.6,
          paddingTop: "8px",
          borderTop: "1px solid rgba(139,92,246,0.15)",
          display: "flex",
          gap: "6px",
          alignItems: "flex-start",
        }}
      >
        <span style={{ marginTop: "1px" }}>✦</span>
        <span>{solution}</span>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  body,
  accent,
}: {
  number: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: 700,
          color: accent,
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div style={{ paddingTop: "4px" }}>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#fafafa", marginBottom: "6px" }}>
          {title}
        </div>
        <div style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.65 }}>{body}</div>
      </div>
    </div>
  );
}

function FeatureChip({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 500,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        color: "#a1a1aa",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function AnonymousProfileCard() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "20px",
        width: "100%",
        maxWidth: "340px",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #8b5cf6, #c084fc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          🎯
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#fafafa" }}>QuantumCoder_99</div>
          <div style={{ fontSize: "12px", color: "#71717a" }}>B.Tech CSE · 3rd year</div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            padding: "3px 10px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 600,
            background: "rgba(52, 211, 153, 0.12)",
            border: "1px solid rgba(52, 211, 153, 0.3)",
            color: "#34d399",
          }}
        >
          89 · Reliable
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {[
          { label: "Python L3", color: "#3b82f6" },
          { label: "ML L2", color: "#8b5cf6" },
          { label: "DSA L3", color: "#f59e0b" },
        ].map((b) => (
          <span
            key={b.label}
            style={{
              padding: "3px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 500,
              background: `${b.color}18`,
              border: `1px solid ${b.color}40`,
              color: b.color,
            }}
          >
            ✓ {b.label}
          </span>
        ))}
      </div>

      {/* Interests */}
      <div style={{ fontSize: "12px", color: "#71717a", marginBottom: "16px" }}>
        Interested in fintech, distributed systems, hackathons
      </div>

      {/* Action */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Like →
        </button>
        <button
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 500,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#71717a",
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>

      {/* Reveal hint */}
      <div
        style={{
          marginTop: "12px",
          padding: "8px 12px",
          borderRadius: "10px",
          background: "rgba(139,92,246,0.08)",
          border: "1px solid rgba(139,92,246,0.2)",
          fontSize: "11px",
          color: "#a78bfa",
          textAlign: "center",
        }}
      >
        🔒 Real name revealed only after mutual match + icebreaker
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const problems = [
    {
      icon: "⚡",
      title: "Skill-based discovery is broken",
      problem:
        "LinkedIn is performative and intimidating. WhatsApp groups for hackathons are noisy and skill-blind. Finding a frontend dev for a 48-hour hack means spamming friends-of-friends.",
      solution:
        "Nexus shows verified badge levels, not self-claims. Find a Python L3 + React L2 teammate in 2 minutes.",
    },
    {
      icon: "🏠",
      title: "Roommate matching is luck-based",
      problem:
        "Hostel allocation is random. Off-campus PG matching happens via WhatsApp forwards. A lifestyle mismatch — sleep schedule, cleanliness — wrecks an entire semester.",
      solution:
        "12-question lifestyle compatibility quiz. Hard mismatches flagged. Meet anonymously first.",
    },
    {
      icon: "📚",
      title: "Academic resources are scattered",
      problem:
        "PYQs, notes, and professor reviews live across a thousand Google Drive folders, batchwise WhatsApp groups, and seniors' phones. Freshmen get nothing.",
      solution:
        "OCR-searchable vault indexed by college → branch → semester → course. Community-curated quality.",
    },
    {
      icon: "🔗",
      title: "The referral network is closed",
      problem:
        "Internship referrals at top companies go to whoever the senior remembers from their hostel wing. The most deserving juniors are invisible.",
      solution:
        "Structured Referral Exchange. Apply anonymously with verified badges. Picked candidates reveal identity to referrer only.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Verify your campus identity",
      body: "Sign up with your college institutional email (.ac.in / .edu.in). Gmail is hard-rejected. One account per human — enforced by phone OTP + device check.",
      accent: "#8b5cf6",
    },
    {
      number: "02",
      title: "Earn verified skill badges",
      body: "Complete auto-graded challenges — 10-min coding problems, Figma replications, timed writing prompts. Badges can't be faked or endorsed by friends.",
      accent: "#3b82f6",
    },
    {
      number: "03",
      title: "Browse the anonymous merit feed",
      body: "See pseudonyms, verified badges, project links, and a reliability score. No photos. No real names. No college-tier bias.",
      accent: "#f59e0b",
    },
    {
      number: "04",
      title: "Match → Icebreaker → Reveal",
      body: "Mutual like triggers a shared question based on your interests. Both answer. Identities reveal simultaneously. Chat unlocks. Collaboration begins.",
      accent: "#34d399",
    },
  ];

  const features = [
    "Verified Skill Badges", "Reliability Score", "Anonymous Profiles",
    "Icebreaker Reveal", "PYQ + Notes Vault", "Professor Reviews",
    "Hackathon Team Finder", "Roommate Matching", "Referral Exchange",
    "Campus Marketplace", "Study Rooms", "Event Lobbies",
  ];

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", color: "#fafafa", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(9,9,11,0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #8b5cf6, #c084fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              ⬡
            </div>
            <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.02em" }}>Nexus</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/login"
              style={{
                fontSize: "13px",
                color: "#71717a",
                textDecoration: "none",
                padding: "7px 16px",
                borderRadius: "8px",
                transition: "color 0.15s",
              }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                padding: "7px 18px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                boxShadow: "0 0 20px rgba(139,92,246,0.3)",
              }}
            >
              Join campus →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "140px",
          paddingBottom: "100px",
          paddingLeft: "24px",
          paddingRight: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            position: "relative",
          }}
        >
          <Badge>🇮🇳 Built for Indian college students</Badge>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              textAlign: "center",
              maxWidth: "820px",
            }}
          >
            The campus network that{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #c084fc 50%, #e879f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              judges you on merit,
            </span>{" "}
            not your social circle
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "#71717a",
              maxWidth: "560px",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            Campus-verified. Anonymous-first. Skill-based matching for teammates, roommates,
            mentors, and study partners. Real names appear only after a mutual match.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                boxShadow: "0 0 40px rgba(139,92,246,0.35)",
                letterSpacing: "-0.01em",
              }}
            >
              Join your campus free →
            </Link>
            <a
              href="#how-it-works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#a1a1aa",
                textDecoration: "none",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              See how it works
            </a>
          </div>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
            {["✓ Free for students", "✓ College email only", "✓ Anonymous until match"].map((t) => (
              <span key={t} style={{ fontSize: "12px", color: "#52525b" }}>{t}</span>
            ))}
          </div>

          {/* Floating profile card */}
          <div style={{ marginTop: "16px", width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: "-20px",
                  borderRadius: "40px",
                  background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <AnonymousProfileCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── College strip ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "16px 24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <span style={{ fontSize: "11px", color: "#52525b", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Built for students at
          </span>
          {["IITs", "NITs", "BITS", "IIITs", "VIT", "SRM", "Manipal", "COEP", "DTU", "VJTI"].map((c) => (
            <span key={c} style={{ fontSize: "13px", color: "#3f3f46", fontWeight: 600 }}>{c}</span>
          ))}
          <span style={{ fontSize: "11px", color: "#52525b" }}>+ 500 more</span>
        </div>
      </div>

      {/* ── Problems ── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Badge>The problem</Badge>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              Four things college students struggle with every day
            </h2>
            <p style={{ fontSize: "15px", color: "#71717a", maxWidth: "480px", margin: "0 auto" }}>
              No existing product solves them. WhatsApp is noisy. LinkedIn is performative. And luck shouldn&apos;t determine your semester.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {problems.map((p) => (
              <ProblemCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        style={{
          padding: "96px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Badge>How it works</Badge>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: "16px",
              }}
            >
              Merit first. Identity second.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {steps.map((s) => (
              <StepCard key={s.number} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust stack ── */}
      <section style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Badge>Why it works</Badge>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: "16px",
                marginBottom: "12px",
              }}
            >
              Three layers of trust. Zero fake profiles.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                icon: "🏫",
                color: "#3b82f6",
                title: "Campus email verification",
                body: "Every account is tied to a real institutional email (.ac.in / .edu.in). Gmail is hard-rejected. One account per phone number. Re-verified annually.",
                label: "Layer 1",
              },
              {
                icon: "🏅",
                color: "#8b5cf6",
                title: "Auto-graded skill badges",
                body: "Coding challenges run on Judge0. Design challenges peer-reviewed by 3 verified designers. Writing assessed by rubric. Badges expire in 18 months — skills go stale.",
                label: "Layer 2",
              },
              {
                icon: "⭐",
                color: "#f59e0b",
                title: "Reliability score (0–100)",
                body: "Starts at 70. Goes up when you collaborate and complete. Goes down when you ghost, no-show, or get reported. Below 40: shadow-banned. Below 25: suspended.",
                label: "Layer 3",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "28px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: `${card.color}18`,
                      border: `1px solid ${card.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    {card.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: card.color,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: `${card.color}15`,
                    }}
                  >
                    {card.label}
                  </span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#fafafa", marginBottom: "10px" }}>
                  {card.title}
                </div>
                <div style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.65 }}>{card.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature chips ── */}
      <section
        style={{
          padding: "80px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: "11px",
              color: "#52525b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "24px",
              fontWeight: 500,
            }}
          >
            Everything on one campus layer
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {features.map((f) => (
              <FeatureChip key={f} label={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Badge>Real outcomes</Badge>
            <h2
              style={{
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: "16px",
              }}
            >
              What happens after the reveal
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                quote: "Found my hackathon co-founder through Nexus at 9 PM on a Tuesday. We won the regional round. His DSA badge L3 was the filter that saved me 4 hours of vetting.",
                name: "Aarav S.",
                detail: "B.Tech CSE · Pune",
                emoji: "🏆",
              },
              {
                quote: "Matched with my current roommate before college even started. The lifestyle quiz caught that she's a night owl and I need silence — that would have destroyed us. Compatibility: 91%.",
                name: "Priya M.",
                detail: "B.Tech ECE · Bangalore",
                emoji: "🏠",
              },
              {
                quote: "Got a Razorpay referral through the Referral Exchange. A senior I'd never met picked my profile because of my fintech project and DSA badge. LinkedIn would never have surfaced me.",
                name: "Rohan K.",
                detail: "B.Tech IT · Tier-3 college",
                emoji: "💼",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "16px" }}>{t.emoji}</div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#a1a1aa",
                    lineHeight: 1.7,
                    marginBottom: "20px",
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#fafafa" }}>{t.name}</div>
                  <div style={{ fontSize: "12px", color: "#52525b" }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        style={{
          padding: "100px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(30px, 4.5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Your campus network is already here.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa, #e879f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              You just haven&apos;t joined yet.
            </span>
          </h2>
          <p style={{ fontSize: "15px", color: "#71717a", marginBottom: "32px", lineHeight: 1.6 }}>
            Free for students. Always. Takes 2 minutes. Requires your college email.
          </p>
          <Link
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "15px 36px",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              boxShadow: "0 0 60px rgba(139,92,246,0.4)",
              letterSpacing: "-0.01em",
            }}
          >
            Join your campus — it&apos;s free →
          </Link>
          <p style={{ fontSize: "11px", color: "#3f3f46", marginTop: "16px" }}>
            No ads · No selling your data · No paid boosts · Anonymous until you choose
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #8b5cf6, #c084fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              ⬡
            </div>
            <span style={{ fontSize: "14px", fontWeight: 700 }}>Nexus</span>
          </div>
          <span style={{ fontSize: "12px", color: "#52525b" }}>
            Anonymous merit-based campus network · India · Free for students
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/signup" style={{ fontSize: "12px", color: "#52525b", textDecoration: "none" }}>Sign up</Link>
            <Link href="/login" style={{ fontSize: "12px", color: "#52525b", textDecoration: "none" }}>Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
