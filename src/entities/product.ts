// Product entity - Gestion des produits de stock
import { z } from "zod"

// Schéma de validation pour un produit
export const ProductSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(2).max(100).describe("Nom du produit"),
	brand: z.string().min(1).max(50).describe("Marque du produit"),
	model: z.string().min(1).max(100).describe("Modèle du produit"),
	purchasePrice: z.number().positive().describe("Prix d'achat"),
	sellingPrice: z.number().positive().describe("Prix de vente"),
	imei: z
		.string()
		.regex(/^[0-9]{15}$/, "IMEI doit contenir 15 chiffres")
		.describe("IMEI du téléphone"),
	availableStock: z.number().int().nonnegative().describe("Stock disponible"),
	minStockLevel: z
		.number()
		.int()
		.nonnegative()
		.default(5)
		.describe("Niveau de stock minimum"),
	description: z
		.string()
		.max(500)
		.optional()
		.describe("Description du produit"),
	images: z
		.array(z.string().url())
		.max(5)
		.default([])
		.describe("URLs des images du produit"),
	category: z
		.enum(["phone", "accessory", "component"])
		.default("phone")
		.describe("Catégorie du produit"),
	status: z
		.enum(["active", "inactive", "discontinued"])
		.default("active")
		.describe("Statut du produit"),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	createdBy: z.string().uuid().optional(),
	updatedBy: z.string().uuid().optional(),
})

// Types TypeScript générés à partir du schéma
export type Product = z.infer<typeof ProductSchema>

export type CreateProduct = Omit<Product, "id" | "createdAt" | "updatedAt">
export type UpdateProduct = Partial<CreateProduct>
export type ProductFilters = {
	brand?: string
	category?: string
	status?: string
	minPrice?: number
	maxPrice?: number
	stockStatus?: "low" | "normal" | "out"
	search?: string
}

export interface ProductWithQRCode extends Product {
	qrCode: {
		id: string
		code: string
		imageUrl: string
		generatedAt: Date
	} | null
}

export interface ProductMetrics {
	totalProducts: number
	lowStockProducts: number
	outOfStockProducts: number
	totalValue: number
	averagePrice: number
}

// États de stock
export const StockStatus = {
	LOW: "low" as const,
	NORMAL: "normal" as const,
	OUT: "out" as const,
} as const

export type StockStatusType = (typeof StockStatus)[keyof typeof StockStatus]
