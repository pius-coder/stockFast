import { z } from "zod";
import { ProductCategory, ProductStatus } from "../types/product.types";

// ============================================================================
// ZOD VALIDATION SCHEMA
// ============================================================================

export const productSchema = z
    .object({
        name: z.string().min(2, {
            message: "Le nom doit contenir au moins 2 caractères.",
        }),
        brand: z.string().min(1, {
            message: "La marque est obligatoire.",
        }),
        model: z.string().min(1, {
            message: "Le modèle est obligatoire.",
        }),
        purchasePrice: z.string().refine((val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        }, {
            message: "Le prix d'achat doit être un nombre positif.",
        }),
        sellingPrice: z.string().refine((val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        }, {
            message: "Le prix de vente doit être un nombre positif.",
        }),
        imei: z.string().regex(/^\d{15}$/, {
            message: "L'IMEI doit contenir exactement 15 chiffres.",
        }),
        availableStock: z.string().refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 0;
        }, {
            message: "Le stock disponible doit être un nombre positif ou zéro.",
        }),
        minStockLevel: z.string().refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 0;
        }, {
            message: "Le niveau de stock minimum doit être un nombre positif ou zéro.",
        }),
        description: z.string().optional(),
        category: z.nativeEnum(ProductCategory, {
            message: "Veuillez sélectionner une catégorie valide.",
        }),
        status: z.nativeEnum(ProductStatus, {
            message: "Veuillez sélectionner un statut valide.",
        }).optional(),
    })
    .refine((data) => {
        const purchasePrice = parseFloat(data.purchasePrice);
        const sellingPrice = parseFloat(data.sellingPrice);
        return sellingPrice > purchasePrice;
    }, {
        message: "Le prix de vente doit être supérieur au prix d'achat.",
        path: ["sellingPrice"],
    })
    .refine((data) => {
        const minStock = parseInt(data.minStockLevel);
        const availableStock = parseInt(data.availableStock);
        return minStock <= availableStock;
    }, {
        message: "Le niveau de stock minimum ne peut pas être supérieur au stock disponible.",
        path: ["minStockLevel"],
    });

export type ProductFormValues = z.infer<typeof productSchema>;

// ============================================================================
// FORM FIELD CONFIGURATION
// ============================================================================

export type ProductFormFieldType = "input" | "number" | "textarea" | "select" | "imei";

export interface ProductFormFieldConfig {
    name: keyof ProductFormValues;
    label: string;
    type: ProductFormFieldType;
    placeholder?: string;
    description?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
}

export const PRODUCT_FORM_CONFIG: ProductFormFieldConfig[] = [
    {
        name: "name",
        label: "Nom du produit",
        type: "input",
        placeholder: "iPhone 15 Pro",
        description: "Nom complet du produit",
        required: true,
    },
    {
        name: "brand",
        label: "Marque",
        type: "input",
        placeholder: "Apple",
        description: "Marque du produit",
        required: true,
    },
    {
        name: "model",
        label: "Modèle",
        type: "input",
        placeholder: "iPhone 15 Pro",
        description: "Modèle spécifique du produit",
        required: true,
    },
    {
        name: "category",
        label: "Catégorie",
        type: "select",
        description: "Catégorie du produit",
        required: true,
        options: [
            { value: ProductCategory.PHONE, label: "Téléphone" },
            { value: ProductCategory.ACCESSORY, label: "Accessoire" },
            { value: ProductCategory.COMPONENT, label: "Composant" },
        ],
    },
    {
        name: "purchasePrice",
        label: "Prix d'achat (FCFA)",
        type: "number",
        placeholder: "500000",
        description: "Prix d'achat en francs CFA",
        required: true,
    },
    {
        name: "sellingPrice",
        label: "Prix de vente (FCFA)",
        type: "number",
        placeholder: "650000",
        description: "Prix de vente en francs CFA",
        required: true,
    },
    {
        name: "imei",
        label: "IMEI",
        type: "imei",
        placeholder: "123456789012345",
        description: "Numéro IMEI du produit (15 chiffres)",
        required: true,
    },
    {
        name: "availableStock",
        label: "Stock disponible",
        type: "number",
        placeholder: "10",
        description: "Quantité en stock",
        required: true,
    },
    {
        name: "minStockLevel",
        label: "Niveau de stock minimum",
        type: "number",
        placeholder: "5",
        description: "Seuil d'alerte de stock",
        required: true,
    },
    {
        name: "status",
        label: "Statut",
        type: "select",
        description: "Statut du produit",
        options: [
            { value: ProductStatus.ACTIVE, label: "Actif" },
            { value: ProductStatus.INACTIVE, label: "Inactif" },
            { value: ProductStatus.DISCONTINUED, label: "Arrêté" },
        ],
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Description détaillée du produit...",
        description: "Description optionnelle du produit",
    },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts form values to API format
 */
export function convertToApiFormat(values: ProductFormValues) {
    return {
        ...values,
        purchasePrice: parseFloat(values.purchasePrice),
        sellingPrice: parseFloat(values.sellingPrice),
        availableStock: parseInt(values.availableStock),
        minStockLevel: parseInt(values.minStockLevel),
    };
}

/**
 * Converts API format to form values
 */
export function convertFromApiFormat(apiData: any): ProductFormValues {
    return {
        ...apiData,
        purchasePrice: apiData.purchasePrice?.toString() || "",
        sellingPrice: apiData.sellingPrice?.toString() || "",
        availableStock: apiData.availableStock?.toString() || "0",
        minStockLevel: apiData.minStockLevel?.toString() || "0",
    };
}

/**
 * Validates IMEI format
 */
export function isValidIMEI(imei: string): boolean {
    return /^\d{15}$/.test(imei);
}

/**
 * Calculates profit margin
 */
export function calculateProfitMargin(purchasePrice: number, sellingPrice: number): number {
    if (purchasePrice === 0) return 0;
    return Math.round(((sellingPrice - purchasePrice) / purchasePrice) * 100);
}

/**
 * Checks if stock is low
 */
export function isStockLow(availableStock: number, minStockLevel: number): boolean {
    return availableStock <= minStockLevel;
}

/**
 * Gets stock status
 */
export function getStockStatus(availableStock: number, minStockLevel: number): 'normal' | 'low' | 'out' {
    if (availableStock === 0) return 'out';
    if (availableStock <= minStockLevel) return 'low';
    return 'normal';
}