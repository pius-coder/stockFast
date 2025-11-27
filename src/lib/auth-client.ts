/**
 * BetterAuth Client Configuration - stockFast
 * Configuration du client d'authentification pour l'application de gestion de stock
 */

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://10.132.147.80:3000",
})

export { authClient as auth }
