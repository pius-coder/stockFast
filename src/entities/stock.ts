// Stock entity - Gestion des niveaux de stock et mouvements
import { z } from "zod"

export const StockMovementSchema = z.object({
	id: z.string().uuid().optional(),
	productId: z.string().uuid().describe("ID du produit"),
	type: z
		.enum(["IN", "OUT", "ADJUSTMENT", "SALE", "PURCHASE", "RETURN", "DAMAGE"])
		.describe("Type de mouvement"),
	quantity: z.number().int().nonnegative().describe("Quantité"),
	previousStock: z.number().int().nonnegative().describe("Stock précédent"),
	newStock: z.number().int().nonnegative().describe("Nouveau stock"),
	reason: z.string().max(200).optional().describe("Raison du mouvement"),
	notes: z.string().max(500).optional().description("Notes additionnelles"),
	performedBy: z
		.string()
		.uuid()
		.describe("Utilisateur ayant effectué l'action"),
	referenceId: z
		.string()
		.uuid()
		.optional()
		.describe("ID de référence (vente, achat, etc.)"),
	createdAt: z.date().optional(),
})

export const StockAlertSchema = z.object({
	id: z.string().uuid().optional(),
	productId: z.string().uuid().describe("ID du produit"),
	type: z
		.enum(["LOW_STOCK", "OUT_OF_STOCK", "EXPIRY_SOON"])
		.describe("Type d'alerte"),
	threshold: z.number().int().nonnegative().describe("Seuil de déclenchement"),
	currentStock: z.number().int().nonnegative().describe("Stock actuel"),
	isActive: z.boolean().default(true).describe("Alerte active"),
	notifiedAt: z.date().optional(),
	acknowledgedAt: z.date().optional(),
	acknowledgedBy: z
		.string()
		.uuid()
		.optional()
		.describe("Utilisateur ayant reconnu l'alerte"),
	createdAt: z.date().optional(),
})

export type StockMovement = z.infer<typeof StockMovementSchema>
export type StockAlert = z.infer<typeof StockAlertSchema>

export type CreateStockMovement = Omit<StockMovement, "id" | "createdAt">
export type CreateStockAlert = Omit<StockAlert, "id" | "createdAt">

export interface StockLevel {
	productId: string
	currentStock: number
	minStockLevel: number
	maxStockLevel?: number
	status: "low" | "normal" | "high" | "out"
	lastUpdated: Date
}

export interface StockHistory {
	productId: string
	movements: StockMovement[]
	totalIn: number
	totalOut: number
	netChange: number
	averageDailySales: number
	daysUntilStockout?: number
}

export interface InventoryItem {
	productId: string
	productName: string
	productBrand: string
	productModel: string
	barcode: string
	currentStock: number
	minStockLevel: number
	lastMovementDate: Date
	status: "in_stock" | "low_stock" | "out_of_stock" | "overstock"
	scanCount: number
	lastScannedAt?: Date
}

// Types d'alertes de stock
export const StockAlertType = {
	LOW_STOCK: "LOW_STOCK",
	OUT_OF_STOCK: "OUT_OF_STOCK",
	EXPIRY_SOON: "EXPIRY_SOON",
} as const

// Types de mouvements de stock
export const StockMovementType = {
	IN: "IN", // Entrée de stock
	OUT: "OUT", // Sortie de stock
	ADJUSTMENT: "ADJUSTMENT", // Ajustement (positif ou négatif)
	SALE: "SALE", // Vente
	PURCHASE: "PURCHASE", // Achat
	RETURN: "RETURN", // Retour client
	DAMAGE: "DAMAGE", // Produit endommagé
} as const
