/**
 * Layout d'Authentification - stockFast
 * Layout centré pour les pages de connexion et d'inscription
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Authentification - stockFast",
    description: "Connexion à votre compte de gestion de stock",
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
            <div className="w-full max-w-md">
                {/* Logo stockFast */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        stockFast
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Gestion de stock intelligente
                    </p>
                </div>

                {/* Contenu (formulaires) */}
                {children}
            </div>
        </div>
    )
}
