"use client";

import { useState, useTransition } from "react";
import { certifyDocument } from "@/app/documents/actions";

const levels = [
  { value: "standard", label: "Standard", description: "Empreinte, date, QR code.", locked: false },
  {
    value: "renforce",
    label: "Renforcé",
    description: "Identité vérifiée par un tiers.",
    locked: true,
  },
  {
    value: "professionnel",
    label: "Professionnel",
    description: "Entreprise vérifiée, historique complet.",
    locked: true,
  },
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
  const upgradeCandidates = isUpgrade
    ? levels.filter((l) => levelOrder.indexOf(l.value) > levelOrder.indexOf(currentLevel!))
    : levels;
  const hasUnlockedUpgrade = upgradeCandidates.some((l) => !l.locked);

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

  // En mode amélioration, si le seul niveau supérieur disponible est
  // verrouillé (pas encore de système de vérification réelle), on le dit
  // honnêtement plutôt que de laisser un faux choix.
  if (isUpgrade && !hasUnlockedUpgrade) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white/50 p-4 text-sm text-neutral-500">
        🔒 Les niveaux Renforcé et Professionnel nécessitent une vérification par un tiers
        (organisme, entreprise) — cette fonctionnalité n&apos;est pas encore disponible. Le niveau
        Standard reste la certification la plus élevée possible pour l&apos;instant.
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-amber-600/80">Avant de continuer</p>
        <h3 className="mt-1 text-base font-semibold text-neutral-900">
          {isUpgrade
            ? "Vous êtes sur le point de renforcer le niveau de certification"
            : "Vous êtes sur le point de créer l'identité numérique de ce document"}
        </h3>
      </div>

      <div className="space-y-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-neutral-600">
        {isUpgrade ? (
          <p>
            L&apos;ancienne certification (niveau {levelLabelOf(currentLevel!)}) sera marquée comme
            remplacée, mais reste consultable dans l&apos;historique — elle n&apos;est jamais supprimée.
          </p>
        ) : (
          <p>
            Cette action attribue à ce document un <strong className="text-neutral-900">KARA-ID permanent</strong> et
            enregistre son empreinte numérique. Vérifiez avant de continuer que :
          </p>
        )}
        {!isUpgrade && (
          <ul className="ml-4 list-disc space-y-1 text-neutral-500">
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

      <p className="text-sm font-medium text-neutral-700">Niveau de certification</p>
      <div className="space-y-2">
        {upgradeCandidates.map((l) => (
          <label
            key={l.value}
            className={`flex items-start gap-3 rounded-lg border p-3 transition ${
              l.locked
                ? "cursor-not-allowed border-neutral-900 opacity-50"
                : "cursor-pointer " + (level === l.value ? "border-neutral-900" : "border-neutral-200")
            }`}
          >
            <input
              type="radio"
              name="level"
              value={l.value}
              checked={level === l.value}
              disabled={l.locked}
              onChange={() => setLevel(l.value)}
              className="mt-1"
            />
            <span>
              <span className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                {l.label}
                {l.locked && (
                  <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-normal text-neutral-600">
                    🔒 Bientôt disponible
                  </span>
                )}
              </span>
              <span className="block text-xs text-neutral-500">{l.description}</span>
            </span>
          </label>
        ))}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-600">
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCertify}
        disabled={isPending || !consentChecked}
        className="w-full rounded-lg bg-neutral-900 py-2.5 font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
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
