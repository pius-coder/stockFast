import { z } from "zod";
import { FormFieldConfig } from "./sign-up-config"; // Réutilisation du type

export const signInSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const SIGN_IN_FORM_CONFIG: FormFieldConfig[] = [
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "m@example.com",
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
    },
];
