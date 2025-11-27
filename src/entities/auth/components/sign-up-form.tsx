"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthFormField } from "../common/form/auth-form-field";
import {
    SIGN_UP_FORM_CONFIG,
    SignUpFormValues,
    signUpSchema,
} from "./sign-up-config";

export function SignUpForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: SignUpFormValues) {
        setIsLoading(true);
        try {
            await authClient.signUp.email(
                {
                    email: values.email,
                    password: values.password,
                    name: values.name,
                },
                {
                    onSuccess: () => {
                        toast.success("Compte créé avec succès! Bienvenue sur stockFast");
                        router.push("/dashboard");
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Échec de création du compte");
                        setIsLoading(false);
                    },
                },
            );
        } catch (error) {
            toast.error("Une erreur s'est produite. Veuillez réessayer.");
            console.error("Erreur d'inscription:", error);
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full bg-card text-card-foreground border shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="font-semibold leading-none tracking-tight text-2xl">
                    Créer un compte
                </h2>
                <p className="text-sm text-muted-foreground">
                    Entrez vos informations pour créer votre compte stockFast
                </p>
            </div>
            <div className="p-6 pt-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {SIGN_UP_FORM_CONFIG.map((fieldConfig) => (
                            <AuthFormField
                                key={fieldConfig.name}
                                config={fieldConfig}
                                control={form.control}
                            />
                        ))}
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Création du compte..." : "Créer un compte"}
                        </Button>
                    </form>
                </Form>
            </div>

        </div>
    );
}
