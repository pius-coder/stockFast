/**
 * BetterAuth API Route Handler - stockFast
 * Route catch-all pour gérer toutes les requêtes d'authentification
 */

import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
