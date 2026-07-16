"use client";

import { useState, useTransition } from "react";
import { verifyByFile } from "@/app/verifier/actions";

export function VerifyByFile({ code }: { code: string }) {
  const [result, setResult] = useState<{ matches: boolean; error?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    startTransition(async () => {
      const res = await verifyByFile(code, file);
      setResult(res);
    });
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-200">
        Comparer le fichier que vous avez reçu
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        accept="application/pdf,image/png,image/jpeg,image/webp"
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
      />
      <p className="text-xs text-neutral-500">
        Le fichier n&apos;est jamais stocké — seule une comparaison d&apos;empreinte est effectuée.
      </p>

      {isPending && <p className="text-sm text-neutral-400">Comparaison…</p>}

      {!isPending && result && (
        <p className={`text-sm font-medium ${result.matches ? "text-emerald-400" : "text-red-400"}`}>
          {result.error
            ? result.error
            : result.matches
              ? "✓ Ce fichier correspond exactement à la version certifiée."
              : "✗ Ce fichier ne correspond PAS à la version certifiée."}
        </p>
      )}
    </div>
  );
}
