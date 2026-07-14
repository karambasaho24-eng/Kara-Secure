"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  signUpSchema,
  signInSchema,
  resetPasswordRequestSchema,
  updatePasswordSchema,
} from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export type ActionState = {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Inscription. Message d'erreur volontairement générique en cas d'email
 * déjà utilisé, pour éviter l'énumération de comptes existants.
 */
export async function signUp(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    accountType: formData.get("accountType"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    organizationName: formData.get("organizationName") || undefined,
  });

  if (!parsed.success) {
    return {
      error: "Merci de corriger les champs ci-dessous.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { accountType, fullName, email, password, organizationName } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, account_type: accountType },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
    },
  });

  if (error) {
    // Message générique : on ne révèle jamais si l'email existe déjà.
    return { error: "Impossible de créer le compte. Vérifiez vos informations." };
  }

  // Compte entreprise : créer l'organisation + attribuer le rôle org_admin.
  // Fait ici plutôt que dans le trigger DB pour garder le trigger simple et
  // parce que ça nécessite une lecture de la table roles (logique métier, pas
  // structurelle).
  if (accountType === "business" && data.user && organizationName) {
    const admin = createAdminClient();

    const { data: org, error: orgError } = await admin
      .from("organizations")
      .insert({ name: organizationName, owner_id: data.user.id })
      .select("id")
      .single();

    if (!orgError && org) {
      const { data: role } = await admin
        .from("roles")
        .select("id")
        .eq("key", "org_admin")
        .single();

      if (role) {
        await admin.from("user_roles").insert({
          user_id: data.user.id,
          role_id: role.id,
          organization_id: org.id,
          granted_by: data.user.id,
        });
      }
    }
  }

  redirect("/auth/confirm?envoye=1");
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Merci de renseigner un email et un mot de passe valides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Message générique : ne distingue jamais "email inconnu" de
    // "mot de passe incorrect".
    return { error: "Email ou mot de passe incorrect." };
  }

  redirect("/compte");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: "Adresse email invalide." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/mot-de-passe-oublie/nouveau`,
  });

  // Toujours le même message, que l'email existe ou non (anti-énumération).
  return { error: null };
}

export async function updatePassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: "Merci de corriger les champs ci-dessous.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Impossible de mettre à jour le mot de passe. Réessayez la procédure." };
  }

  redirect("/connexion?reinitialise=1");
}
