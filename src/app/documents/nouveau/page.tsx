import { UploadDocumentForm } from "@/components/documents/upload-form";

export default function NouveauDocumentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Nouveau document</h1>
        <p className="mb-8 text-sm text-neutral-400">
          Envoyez un document pour pouvoir le certifier.
        </p>
        <UploadDocumentForm />
      </div>
    </main>
  );
}
