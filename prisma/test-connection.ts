#!/usr/bin/env tsx
/**
 * Test de connexion à la base de données PostgreSQL
 * Sprint 1 - US01-001: Configuration de l'environnement
 */

import { prisma } from "@/lib/prisma"

async function testDatabaseConnection() {
    console.log("🔍 Test de connexion à la base de données PostgreSQL...")
    console.log("=".repeat(60))

    try {
        // Test 1: Connexion basique
        console.log("\n✓ Test 1: Connexion à la base de données")
        await prisma.$connect()
        console.log("  ✅ Connexion établie avec succès")

        // Test 2: Requête simple
        console.log("\n✓ Test 2: Exécution d'une requête SQL")
        const result = await prisma.$queryRaw`SELECT NOW() as current_time`
        console.log("  ✅ Requête exécutée:", result)

        // Test 3: Vérification des tables
        console.log("\n✓ Test 3: Vérification des modèles Prisma")
        const userCount = await prisma.user.count()
        const productCount = await prisma.product.count()
        const saleCount = await prisma.sale.count()

        console.log(`  ✅ Utilisateurs: ${userCount}`)
        console.log(`  ✅ Produits: ${productCount}`)
        console.log(`  ✅ Ventes: ${saleCount}`)

        // Test 4: Métadonnées de la base
        console.log("\n✓ Test 4: Informations de la base de données")
        const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as user_name,
        version() as postgres_version
    `
        console.log("  ✅ Base de données:", dbInfo)

        console.log("\n" + "=".repeat(60))
        console.log("✅ TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS!")
        console.log("=".repeat(60))

        return true
    } catch (error) {
        console.error("\n❌ ERREUR lors du test de connexion:")
        console.error(error)
        return false
    } finally {
        await prisma.$disconnect()
        console.log("\n🔌 Déconnexion de la base de données")
    }
}

// Exécution du test
testDatabaseConnection()
    .then((success) => {
        process.exit(success ? 0 : 1)
    })
    .catch((error) => {
        console.error("Erreur fatale:", error)
        process.exit(1)
    })
