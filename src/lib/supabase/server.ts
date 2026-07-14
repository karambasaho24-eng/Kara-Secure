import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

/**
 * Client Supabase pour usage côté serveur (Server Components, Server Actions,
 * Route Handlers). Lit/écrit les cookies de session via next/headers.
 * Ne jamais réutiliser une instance entre requêtes : toujours en créer une
 * nouvelle par requête (recommandation officielle Supabase).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll appelé depuis un Server Component : ignorable si un
            // middleware rafraîchit déjà les sessions utilisateur.
          }
        },
      },
    }
  );
}
