// ============================================================================
// PRODUCT VALIDATION SCHEMAS
// Zod schemas for product validation
// ============================================================================

import { z } from "zod";

// Validation schema for creating product
export const createProductSchema = z.object({
    name: z.string()
        .min(2, "Le nom doit contenir au moins 2 caractères"),
    brand: z.string()
        .min(1, "La marque est obligatoire"),
    model: z.string()
        .min(1, "Le modèle est obligatoire"),
    purchasePrice: z.number()
        .positive("Le prix d'achat doit être positif"),
    sellingPrice: z.number()
        .positive("Le prix de vente doit être positif"),
    imei: z.string()
        .regex(/^\d{15}$/, "L'IMEI doit contenir exactement 15 chiffres"),
    availableStock: z.number()
        .min(0, "Le stock disponible doit être positif ou zéro"),
    minStockLevel: z.number()
        .min(0, "Le niveau de stock minimum doit être positif ou zéro"),
    description: z.string().optional(),
    category: z.enum(['PHONE', 'ACCESSORY', 'COMPONENT']),
    status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']).optional()
}).refine((data) => {
    return data.sellingPrice > data.purchasePrice;
}, {
    message: "Le prix de vente doit être supérieur au prix d'achat",
    path: ["sellingPrice"],
}).refine((data) => {
    return data.minStockLevel <= data.availableStock;
}, {
    message: "Le niveau de stock minimum ne peut pas être supérieur au stock disponible",
    path: ["minStockLevel"],
});

// Validation schema for updating product
export const updateProductSchema = createProductSchema
    .partial()
    .extend({
        id: z.string().min(1, "ID du produit requis")
    });

export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;
