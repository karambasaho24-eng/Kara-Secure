"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CertifyButton } from "@/components/documents/certify-button";

export function UpgradeCertificationSection({
  documentId,
  currentLevel,
}: {
  documentId: string;
  currentLevel: "standard" | "renforce" | "professionnel";
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (currentLevel === "professionnel") {
    return null; // déjà au niveau maximum
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
      >
        Améliorer le niveau de certification
      </button>
    );
  }

  return (
    <CertifyButton
      documentId={documentId}
      currentLevel={currentLevel}
      onDone={() => {
        setOpen(false);
        router.refresh();
      }}
    />
  );
}
