import { Control } from "react-hook-form";
import { z } from "zod";

export const signUpSchema = z
    .object({
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
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
        label: "Name",
        type: "input",
        placeholder: "John Doe",
    },
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
    {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "••••••••",
    },
];
