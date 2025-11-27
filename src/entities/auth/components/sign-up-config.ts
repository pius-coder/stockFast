import { Control } from "react-hook-form";
import { z } from "zod";

export const signUpSchema = z
    .object({
        name: z.string().min(2, {
            message: "Le nom doit contenir au moins 2 caractères.",
        }),
        email: z.string().email({
            message: "Veuillez entrer une adresse email valide.",
        }),
        password: z.string().min(8, {
            message: "Le mot de passe doit contenir au moins 8 caractères.",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export type FormFieldType = "input" | "password" | "email";

export interface FormFieldConfig {
    name: keyof SignUpFormValues;
    label: string;
    type: FormFieldType;
    placeholder: string;
    description?: string;
}

export const SIGN_UP_FORM_CONFIG: FormFieldConfig[] = [
    {
        name: "name",
        label: "Nom complet",
        type: "input",
        placeholder: "Jean Dupont",
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "votre@email.com",
    },
    {
        name: "password",
        label: "Mot de passe",
        type: "password",
        placeholder: "••••••••",
    },
    {
        name: "confirmPassword",
        label: "Confirmer le mot de passe",
        type: "password",
        placeholder: "••••••••",
    },
];
