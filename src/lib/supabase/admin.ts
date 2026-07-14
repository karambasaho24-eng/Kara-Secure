import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Client Supabase avec la service_role key : bypass RLS.
 * `import "server-only"` fait échouer le build si ce fichier est
 * accidentellement importé dans un Client Component.
 *
 * Réservé aux opérations administratives explicites (ex: CMS interne,
 * traitement de webhooks Stripe). Ne jamais utiliser pour des requêtes
 * initiées directement par un utilisateur.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
