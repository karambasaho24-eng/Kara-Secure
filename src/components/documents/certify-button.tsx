"use client";

import { useState, useTransition } from "react";
import { certifyDocument } from "@/app/documents/actions";

const levels = [
  { value: "standard", label: "Standard", description: "Empreinte, date, QR code." },
  { value: "renforce", label: "Renforcé", description: "+ identité vérifiée." },
  { value: "professionnel", label: "Professionnel", description: "+ entreprise vérifiée, historique." },
] as const;

type Level = (typeof levels)[number]["value"];

export function CertifyButton({
  documentId,
  currentLevel,
  onDone,
}: {
  documentId: string;
  /** Si fourni, on est en mode "amélioration" d'une certification existante. */
  currentLevel?: Level;
  onDone?: () => void;
}) {
  const levelOrder: Level[] = ["standard", "renforce", "professionnel"];
  const defaultLevel = currentLevel
    ? levelOrder[Math.min(levelOrder.indexOf(currentLevel) + 1, levelOrder.length - 1)]
    : "standard";

  const [level, setLevel] = useState<Level>(defaultLevel);
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isUpgrade = Boolean(currentLevel);
  const availableLevels = isUpgrade
    ? levels.filter((l) => levelOrder.indexOf(l.value) > levelOrder.indexOf(currentLevel!))
    : levels;

  function handleCertify() {
    setError(null);
    startTransition(async () => {
      const result = await certifyDocument(documentId, level);
      if (result.error) {
        setError(result.error);
      } else {
        onDone?.();
      }
    });
  }

  return (
    <div className="space-y-5 rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-black p-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-amber-400/80">Avant de continuer</p>
        <h3 className="mt-1 text-base font-semibold text-white">
          {isUpgrade
            ? "Vous êtes sur le point de renforcer le niveau de certification"
            : "Vous êtes sur le point de créer l'identité numérique de ce document"}
        </h3>
      </div>

      <div className="space-y-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-neutral-300">
        {isUpgrade ? (
          <p>
            L&apos;ancienne certification (niveau {levelLabelOf(currentLevel!)}) sera marquée comme
            remplacée, mais reste consultable dans l&apos;historique — elle n&apos;est jamais supprimée.
          </p>
        ) : (
          <p>
            Cette action attribue à ce document un <strong className="text-white">KARA-ID permanent</strong> et
            enregistre son empreinte numérique. Vérifiez avant de continuer que :
          </p>
        )}
        {!isUpgrade && (
          <ul className="ml-4 list-disc space-y-1 text-neutral-400">
            <li>c&apos;est bien le bon fichier (pas un brouillon ou une version test) ;</li>
            <li>
              le contenu est correct — une erreur détectée après coup demandera une nouvelle version
              avec un délai d&apos;observation de 48h avant confirmation ;
            </li>
            <li>
              vous consentez à ce que ce document soit conservé de façon sécurisée par KARA Secure pour
              permettre sa vérification future.
            </li>
          </ul>
        )}
        <p className="text-xs text-neutral-500">
          Pour rappel, honnêtement : KARA Secure prouve qu&apos;un document n&apos;a pas changé depuis son
          enregistrement — ce n&apos;est pas une garantie que son contenu est véridique.
        </p>
      </div>

      <p className="text-sm font-medium text-neutral-200">Niveau de certification</p>
      <div className="space-y-2">
        {availableLevels.map((l) => (
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

      <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          className="mt-1"
        />
        <span>
          J&apos;ai vérifié que ce document est correct et je consens à sa certification et à sa
          conservation sécurisée par KARA Secure.
        </span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleCertify}
        disabled={isPending || !consentChecked}
        className="w-full rounded-lg bg-white py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending
          ? "Certification en cours…"
          : isUpgrade
            ? "Confirmer le nouveau niveau"
            : "Confirmer et créer l'identité numérique"}
      </button>
    </div>
  );
}

function levelLabelOf(level: Level) {
  return levels.find((l) => l.value === level)?.label ?? level;
}
