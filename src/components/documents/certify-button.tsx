"use client";

import { useState, useTransition } from "react";
import { certifyDocument } from "@/app/documents/actions";

const levels = [
  { value: "standard", label: "Standard", description: "Empreinte, date, QR code." },
  { value: "renforce", label: "Renforcé", description: "+ identité vérifiée." },
  { value: "professionnel", label: "Professionnel", description: "+ entreprise vérifiée, historique." },
] as const;

export function CertifyButton({ documentId }: { documentId: string }) {
  const [level, setLevel] = useState<(typeof levels)[number]["value"]>("standard");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCertify() {
    setError(null);
    startTransition(async () => {
      const result = await certifyDocument(documentId, level);
      if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-4 rounded-lg border border-neutral-800 p-6">
      <p className="text-sm font-medium text-neutral-200">Niveau de certification</p>
      <div className="space-y-2">
        {levels.map((l) => (
          <label
            key={l.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
              level === l.value ? "border-white" : "border-neutral-800"
            }`}
          >
            <input
              type="radio"
              name="level"
              value={l.value}
              checked={level === l.value}
              onChange={() => setLevel(l.value)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-medium text-white">{l.label}</span>
              <span className="block text-xs text-neutral-500">{l.description}</span>
            </span>
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleCertify}
        disabled={isPending}
        className="w-full rounded-lg bg-white py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {isPending ? "Certification en cours…" : "Certifier ce document"}
      </button>
    </div>
  );
}
