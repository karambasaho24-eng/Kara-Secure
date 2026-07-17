"use client";

import { useEffect, useState } from "react";

const TARGET_HASH = "7ea92ed7a077f1f143ffd3f64788440d2568999da11e2959887f853810e0776f";
const HEX_CHARS = "0123456789abcdef";

export function FingerprintCard() {
  const [displayHash, setDisplayHash] = useState("·".repeat(TARGET_HASH.length));
  const [sealed, setSealed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayHash(TARGET_HASH);
      setSealed(true);
      return;
    }

    let frame = 0;
    const totalFrames = 28;
    const interval = setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * TARGET_HASH.length);

      setDisplayHash(
        TARGET_HASH.split("")
          .map((char, i) =>
            i < revealCount ? char : HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
          )
          .join("")
      );

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayHash(TARGET_HASH);
        setTimeout(() => setSealed(true), 200);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      <div
        className="relative overflow-hidden rounded-2xl border p-6"
        style={{
          borderColor: "var(--color-border)",
          background: "linear-gradient(160deg, var(--color-ink-card), var(--color-ink))",
        }}
      >
        {/* ligne de scan */}
        <div
          className="pointer-events-none absolute inset-x-0 h-24 opacity-40"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--color-gold-dim) 45%, transparent)",
            animation: sealed ? "none" : "scan 1.3s ease-in-out",
          }}
        />

        <div className="mb-5 flex items-center justify-between">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--color-text-dim)" }}
          >
            Fiche_de_paie.pdf
          </span>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[10px] transition-opacity duration-500"
            style={{
              color: "var(--color-verified)",
              background: "rgba(52,211,153,0.1)",
              opacity: sealed ? 1 : 0,
            }}
          >
            KS-2026-849291
          </span>
        </div>

        <div className="space-y-3">
          <div
            className="h-2 w-4/5 rounded-full"
            style={{ background: "var(--color-border)" }}
          />
          <div
            className="h-2 w-3/5 rounded-full"
            style={{ background: "var(--color-border)" }}
          />
          <div
            className="h-2 w-full rounded-full"
            style={{ background: "var(--color-border)" }}
          />
        </div>

        <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
          <p
            className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "var(--color-text-dim)" }}
          >
            Empreinte SHA-256
          </p>
          <p className="break-all font-mono text-[11px] leading-relaxed" style={{ color: sealed ? "var(--color-gold-bright)" : "var(--color-text-muted)" }}>
            {displayHash}
          </p>
        </div>

        {/* sceau */}
        <div
          className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all duration-700"
          style={{
            borderColor: "var(--color-gold)",
            background: "var(--color-ink)",
            opacity: sealed ? 1 : 0,
            transform: sealed ? "scale(1) rotate(-12deg)" : "scale(0.6) rotate(-12deg)",
          }}
        >
          <div
            className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full border"
            style={{ borderColor: "var(--color-gold)" }}
          >
            <span
              className="font-display text-[9px] leading-none tracking-wide"
              style={{ color: "var(--color-gold-bright)" }}
            >
              CERTIFIÉ
            </span>
            <span className="mt-1 font-mono text-[7px]" style={{ color: "var(--color-gold)" }}>
              KARA SECURE
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(220%); }
        }
      `}</style>
    </div>
  );
}
