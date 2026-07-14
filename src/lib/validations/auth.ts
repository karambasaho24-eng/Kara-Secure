import { z } from "zod";

/**
 * Types de compte ouverts à l'inscription publique.
 * "internal_staff" est volontairement exclu : ce type de compte ne peut
 * être créé que manuellement en base par un Super Admin (voir Phase 9).
 */
export const publicAccountTypes = ["individual", "professional", "business"] as const;

export const signUpSchema = z
  .object({
    accountType: z.enum(publicAccountTypes, {
      message: "Sélectionnez un type de compte valide.",
    }),
    fullName: z.string().trim().min(2, "Nom trop court.").max(120),
    email: z.email("Adresse email invalide."),
    password: z
      .string()
      .min(12, "12 caractères minimum.")
      .regex(/[A-Z]/, "Au moins une majuscule.")
      .regex(/[a-z]/, "Au moins une minuscule.")
      .regex(/[0-9]/, "Au moins un chiffre.")
      .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial."),
    confirmPassword: z.string(),
    organizationName: z.string().trim().max(200).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.accountType !== "business" ||
      (data.organizationName && data.organizationName.length >= 2),
    {
      message: "Le nom de l'entreprise est requis pour un compte entreprise.",
      path: ["organizationName"],
    }
  );

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Adresse email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const resetPasswordRequestSchema = z.object({
  email: z.email("Adresse email invalide."),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, "12 caractères minimum.")
      .regex(/[A-Z]/, "Au moins une majuscule.")
      .regex(/[a-z]/, "Au moins une minuscule.")
      .regex(/[0-9]/, "Au moins un chiffre.")
      .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });
