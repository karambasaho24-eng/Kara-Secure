"use client";

import { useState, useTransition } from "react";
import { verifyByCode, type VerificationResult } from "@/app/verifier/actions";
import { VerifyByFile } from "@/components/verify/verify-by-file";

const levelLabels: Record<string, string> = {
  standard: "Standard",
  renforce: "Renforcé",
  professionnel: "Professionnel",
};

export function VerifyForm({ initialCode }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode ?? "");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await verifyByCode(code);
      setResult(res);
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Identifiant KARA (ex: KS-2026-849291)"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white outline-none focus:border-white"
        />
        <button
          type="submit"
          disabled={isPending || !code}
          className="rounded-lg bg-white px-5 py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {isPending ? "…" : "Vérifier"}
        </button>
      </form>

      {result && (
        <div
          className={`rounded-lg border p-6 ${
            result.found
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-red-500/30 bg-red-500/5"
          }`}
        >
          {!result.found ? (
            <p className="text-sm text-red-400">
              {result.error ?? "Document introuvable."}
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-emerald-400">✓ Document trouvé</p>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">KARA-ID</dt>
                  <dd className="font-mono text-neutral-200">{result.karaId}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">
                    Niveau de certification
                  </dt>
                  <dd className="text-neutral-200">
                    {result.level ? levelLabels[result.level] : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">
                    Certifié le
                  </dt>
                  <dd className="text-neutral-200">
                    {result.certifiedAt
                      ? new Date(result.certifiedAt).toLocaleString("fr-FR")
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">
                    Intégrité
                  </dt>
                  <dd className={result.integrityOk ? "text-emerald-400" : "text-orange-400"}>
                    {result.integrityOk
                      ? "Aucune modification détectée depuis la certification"
                      : "⚠ Le document a été modifié depuis la certification"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">Statut</dt>
                  <dd className={result.status === "active" ? "text-emerald-400" : "text-red-400"}>
                    {result.status === "active" ? "Actif" : "Révoqué"}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-neutral-800 pt-4">
                <VerifyByFile code={code} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
