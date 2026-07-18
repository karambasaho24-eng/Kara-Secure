"use client";

import { useEffect, useRef, useState } from "react";

type Stage = "raw" | "scanning" | "hashing" | "sealing" | "card" | "verify";

const STAGE_ORDER: Stage[] = ["raw", "scanning", "hashing", "sealing", "card", "verify"];
const STAGE_DURATIONS: Record<Stage, number> = {
  raw: 1400,
  scanning: 1200,
  hashing: 1600,
  sealing: 1100,
  card: 2400,
  verify: 2600,
};

const TARGET_HASH = "7ea92ed7a077f1f143ffd3f64788440d2568999da11e2959887f853810e0776f";
const HEX_CHARS = "0123456789abcdef";

export function CertificationStory() {
  const [stage, setStage] = useState<Stage>("raw");
  const [hashDisplay, setHashDisplay] = useState("·".repeat(24));
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) {
      setStage("verify");
      setHashDisplay(TARGET_HASH.slice(0, 24));
      return;
    }

    let cancelled = false;
    let idx = 0;

    function advance() {
      if (cancelled) return;
      const current = STAGE_ORDER[idx];
      setStage(current);
      const delay = STAGE_DURATIONS[current];
      setTimeout(() => {
        if (cancelled) return;
        idx = (idx + 1) % STAGE_ORDER.length;
        advance();
      }, delay);
    }
    advance();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (stage !== "hashing") return;
    let frame = 0;
    const totalFrames = 22;
    const shortHash = TARGET_HASH.slice(0, 24);
    const interval = setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * shortHash.length);
      setHashDisplay(
        shortHash
          .split("")
          .map((c, i) => (i < revealCount ? c : HEX_CHARS[Math.floor(Math.random() * 16)]))
          .join("")
      );
      if (frame >= totalFrames) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [stage]);

  const idx = STAGE_ORDER.indexOf(stage);
  const isAtLeast = (s: Stage) => idx >= STAGE_ORDER.indexOf(s);
  const showCard = stage === "card" || stage === "verify";

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle, rgba(184,147,90,0.18) 0%, transparent 70%)",
          opacity: isAtLeast("sealing") ? 1 : 0.3,
        }}
      />

      <div
        className="relative rounded-2xl border p-6 transition-all duration-700"
        style={{
          borderColor: isAtLeast("sealing") ? "var(--color-gold)" : "var(--color-border)",
          background: "linear-gradient(160deg, var(--color-ink-card), var(--color-ink))",
          boxShadow: isAtLeast("sealing") ? "0 0 60px -12px rgba(184,147,90,0.35)" : "none",
          minHeight: 300,
        }}
      >
        <div
          className="transition-all duration-500"
          style={{
            opacity: showCard ? 0 : 1,
            transform: showCard ? "scale(0.92) translateY(-8px)" : "scale(1) translateY(0)",
            position: showCard ? "absolute" : "static",
            inset: showCard ? 0 : undefined,
            pointerEvents: showCard ? "none" : "auto",
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--color-text-dim)" }}
            >
              fiche_de_paie.pdf
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] transition-colors duration-500"
              style={{
                color: isAtLeast("sealing") ? "var(--color-verified)" : "var(--color-warning)",
                background: isAtLeast("sealing") ? "rgba(52,211,153,0.1)" : "rgba(251,146,60,0.1)",
              }}
            >
              {isAtLeast("sealing") ? "Protégé" : "Non vérifiable"}
            </span>
          </div>

          <div
            className="relative overflow-hidden rounded-lg border p-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="space-y-2.5">
              <div className="h-2 w-4/5 rounded-full" style={{ background: "var(--color-border)" }} />
              <div className="h-2 w-3/5 rounded-full" style={{ background: "var(--color-border)" }} />
              <div className="h-2 w-full rounded-full" style={{ background: "var(--color-border)" }} />
              <div className="h-2 w-2/3 rounded-full" style={{ background: "var(--color-border)" }} />
            </div>

            {stage === "scanning" && (
              <div
                className="absolute inset-x-0 h-16"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, rgba(184,147,90,0.35) 45%, transparent)",
                  animation: "kara-scan 1.15s ease-in-out",
                }}
              />
            )}
          </div>

          <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
            <p
              className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.15em]"
              style={{ color: "var(--color-text-dim)" }}
            >
              Empreinte SHA-256
            </p>
            <p
              className="font-mono text-[11px] transition-colors duration-500"
              style={{ color: isAtLeast("hashing") ? "var(--color-gold-bright)" : "var(--color-text-dim)" }}
            >
              {isAtLeast("hashing") ? hashDisplay : "en attente…"}
            </p>
          </div>

          <div
            className="absolute -bottom-4 -right-4 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-700"
            style={{
              background: isAtLeast("sealing") ? "var(--gradient-gold)" : "var(--color-border)",
              boxShadow: isAtLeast("sealing")
                ? "0 6px 20px -6px rgba(184,147,90,0.55), inset 0 1px 1px rgba(255,255,255,0.4)"
                : "none",
              opacity: isAtLeast("sealing") ? 1 : 0,
              transform: isAtLeast("sealing") ? "scale(1) rotate(-10deg)" : "scale(0.5) rotate(-10deg)",
            }}
          >
            <div
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full"
              style={{ background: "var(--color-ink)", border: "1px solid rgba(217,189,134,0.35)" }}
            >
              <span className="font-display text-[8px] tracking-wide" style={{ color: "var(--color-gold-bright)" }}>
                CERTIFIÉ
              </span>
            </div>
          </div>
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: showCard ? 1 : 0,
            transform: showCard ? "rotateY(0deg) scale(1)" : "rotateY(-90deg) scale(0.9)",
            transformStyle: "preserve-3d",
            perspective: "800px",
          }}
        >
          {!showCard ? (
            <div style={{ height: 240 }} />
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: "var(--color-gold)" }}
                >
                  Carte d&apos;identité KARA
                </span>
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-verified)" }} />
              </div>

              <div className="mb-4">
                <p className="font-display text-lg" style={{ color: "var(--color-text)" }}>
                  Fiche de paie
                </p>
                <p className="font-mono text-[11px]" style={{ color: "var(--color-text-dim)" }}>
                  KS-2026-849291
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-1 font-mono text-[9px]" style={{ color: "var(--color-text-muted)" }}>
                  <p>Certifié le 16/07/2026</p>
                  <p
                    style={{
                      color: stage === "verify" ? "var(--color-verified)" : "var(--color-text-muted)",
                    }}
                  >
                    {stage === "verify" ? "✓ Intégrité confirmée" : "Standard"}
                  </p>
                </div>

                <div
                  className="grid h-14 w-14 grid-cols-5 grid-rows-5 gap-[2px] rounded-sm p-1.5"
                  style={{ background: "var(--color-text)" }}
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: [0, 1, 4, 5, 9, 10, 14, 15, 19, 20, 21, 24, 12, 6, 8, 16, 18].includes(
                          i
                        )
                          ? "var(--color-ink)"
                          : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes kara-scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(280%); }
          }
        `}</style>
      </div>

      <p
        className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.15em] transition-opacity duration-300"
        style={{ color: "var(--color-text-dim)" }}
      >
        {stage === "raw" && "Document reçu"}
        {stage === "scanning" && "Analyse en cours"}
        {stage === "hashing" && "Calcul de l'empreinte"}
        {stage === "sealing" && "Certification"}
        {stage === "card" && "Identité numérique créée"}
        {stage === "verify" && "Vérifiable par un tiers, sans compte"}
      </p>
    </div>
  );
}
