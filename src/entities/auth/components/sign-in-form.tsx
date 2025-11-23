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
    SIGN_IN_FORM_CONFIG,
    SignInFormValues,
    signInSchema,
} from "./sign-in-config";

export function SignInForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: SignInFormValues) {
        setIsLoading(true);
        try {
            await authClient.signIn.email(
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    onSuccess: () => {
                        toast.success("Signed in successfully");
                        router.push("/");
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Failed to sign in");
                        setIsLoading(false);
                    },
                },
            );
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error("Sign in error:", error);
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full bg-card text-card-foreground border shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="font-semibold leading-none tracking-tight text-2xl">
                    Sign In
                </h2>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to sign in to your account
                </p>
            </div>
            <div className="p-6 pt-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {SIGN_IN_FORM_CONFIG.map((fieldConfig) => (
                            <AuthFormField
                                key={fieldConfig.name}
                                config={fieldConfig}
                                control={form.control}
                            />
                        ))}
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Form>
            </div>

        </div>
    );
}
