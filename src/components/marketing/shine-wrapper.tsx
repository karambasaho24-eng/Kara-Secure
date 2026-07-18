"use client";

import { useRef } from "react";

/**
 * Enveloppe un médaillon métallique et fait suivre un reflet de lumière au
 * curseur — pas de librairie, juste des custom properties CSS mises à jour
 * au survol. Dégradé, léger, ne pénalise pas les performances.
 */
export function ShineWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--shine-x", `${x}%`);
    el.style.setProperty("--shine-y", `${y}%`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group relative"
      style={{ ["--shine-x" as string]: "50%", ["--shine-y" as string]: "50%" }}
    >
      <div
        className="pointer-events-none absolute -inset-3 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--shine-x) var(--shine-y), rgba(255,255,255,0.35), transparent 55%)",
        }}
      />
      {children}
    </div>
  );
}
