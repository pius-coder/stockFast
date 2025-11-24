/**
 * Page d'Inscription - stockFast
 * Interface d'inscription pour créer un nouveau compte
 */

import { SignUpForm } from "@//entities/auth/components/sign-up-form"
import { GoogleSignInButton } from "@//entities/auth/components/google-signin-button"
import Link from "next/link"

export default function SignUpPage() {
    return (
        <div className="space-y-6">
            {/* Formulaire d'inscription */}
            <SignUpForm />

            {/* Séparateur */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Ou continuer avec
                    </span>
                </div>
            </div>

            {/* Connexion Google */}
            <GoogleSignInButton />

            {/* Lien vers connexion */}
            <div className="text-center text-sm">
                <span className="text-muted-foreground">
                    Vous avez déjà un compte?{" "}
                </span>
                <Link
                    href="/sign-in"
                    className="font-medium text-primary hover:underline"
                >
                    Se connecter
                </Link>
            </div>

            {/* Note de sécurité */}
            <p className="text-xs text-center text-muted-foreground mt-8">
                En créant un compte, vous acceptez nos conditions d&apos;utilisation
                et notre politique de confidentialité.
            </p>
        </div>
    )
}
