import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";

const accountTypeLabels: Record<string, string> = {
  individual: "Particulier",
  professional: "Professionnel",
  business: "Entreprise",
  internal_staff: "Employé interne",
};

export default async function ComptePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, account_type, created_at")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-8 text-2xl font-semibold">Mon compte</h1>

        <dl className="space-y-4 rounded-lg border border-neutral-800 p-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">Nom</dt>
            <dd className="text-sm">{profile?.full_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">Email</dt>
            <dd className="text-sm">{profile?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">Type de compte</dt>
            <dd className="text-sm">
              {profile?.account_type ? accountTypeLabels[profile.account_type] : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">Membre depuis</dt>
            <dd className="text-sm">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("fr-FR")
                : "—"}
            </dd>
          </div>
        </dl>

        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:border-white hover:text-white"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
