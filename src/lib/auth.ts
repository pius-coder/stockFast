/**
 * BetterAuth Server Configuration - stockFast
 * Configuration serveur pour l'authentification de l'application de gestion de stock
 */

import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // À activer en production
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 jours
        updateAge: 60 * 60 * 24, // Mise à jour quotidienne
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        },
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "VENDOR",
                required: false,
            },
        },
    },


})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
