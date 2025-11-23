"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function GoogleSignInButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch (error) {
            console.error("Google sign in error:", error);
            toast.error("Failed to sign in with Google");
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="google"
            className="w-full group"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
        >
            {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                <FcGoogle className="mr-2 h-5 w-5 grayscale group-hover:grayscale-0 transition-all duration-200" />
            )}
            Sign in with Google
        </Button>
    );
}
