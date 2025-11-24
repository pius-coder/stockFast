/**
 * Page de Connexion - stockFast
 * Interface de connexion pour accéder au système de gestion de stock
 */

import { SignInForm } from "@/entities/auth/components/sign-in-form"
import { GoogleSignInButton } from "@/entities/auth/components/google-signin-button"
import Link from "next/link"

export default function SignInPage() {
    return (
        <div className="space-y-6">
            {/* Formulaire de connexion */}
            <SignInForm />

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

            {/* Lien vers inscription */}
            <div className="text-center text-sm">
                <span className="text-muted-foreground">
                    Vous n&apos;avez pas de compte?{" "}
                </span>
                <Link
                    href="/sign-up"
                    className="font-medium text-primary hover:underline"
                >
                    Créer un compte
                </Link>
            </div>

            {/* Note de sécurité */}
            <p className="text-xs text-center text-muted-foreground mt-8">
                En vous connectant, vous acceptez nos conditions d&apos;utilisation
                et notre politique de confidentialité.
            </p>
        </div>
    )
}
