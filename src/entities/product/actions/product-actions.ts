"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { generateProductQRCode } from "@/lib/qrcode";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// Validation schema for creating product
const createProductSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    brand: z.string().min(1, "La marque est obligatoire"),
    model: z.string().min(1, "Le modèle est obligatoire"),
    purchasePrice: z.number().positive("Le prix d'achat doit être positif"),
    sellingPrice: z.number().positive("Le prix de vente doit être positif"),
    imei: z.string().regex(/^\d{15}$/, "L'IMEI doit contenir exactement 15 chiffres"),
    availableStock: z.number().min(0, "Le stock disponible doit être positif ou zéro"),
    minStockLevel: z.number().min(0, "Le niveau de stock minimum doit être positif ou zéro"),
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
const updateProductSchema = createProductSchema.partial().extend({
    id: z.string().min(1, "ID du produit requis")
});

// ============================================================================
// SERVER ACTIONS
// ============================================================================

/**
 * Create a new product
 */
export async function createProduct(formData: FormData) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return {
                success: false,
                error: "Authentification requise",
                fieldErrors: null
            };
        }

        // Extract form data
        const data = {
            name: formData.get('name') as string,
            brand: formData.get('brand') as string,
            model: formData.get('model') as string,
            purchasePrice: parseFloat(formData.get('purchasePrice') as string),
            sellingPrice: parseFloat(formData.get('sellingPrice') as string),
            imei: formData.get('imei') as string,
            availableStock: parseInt(formData.get('availableStock') as string),
            minStockLevel: parseInt(formData.get('minStockLevel') as string),
            description: formData.get('description') as string || undefined,
            category: formData.get('category') as string,
            status: formData.get('status') as string || 'ACTIVE'
        };

        // Validate data
        const validatedData = createProductSchema.parse(data);

        // Check if IMEI already exists
        const existingProduct = await prisma.product.findUnique({
            where: { imei: validatedData.imei }
        });

        if (existingProduct) {
            return {
                success: false,
                error: "Un produit avec cet IMEI existe déjà",
                fieldErrors: { imei: "Cet IMEI est déjà utilisé" }
            };
        }

        // Create product with transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the product
            const product = await tx.product.create({
                data: {
                    ...validatedData,
                    createdBy: session.user.id,
                    images: [] // Initialize empty images array
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });

            // Generate QR code using utility function with error handling
            let qrCode;
            try {
                const qrCodeImageData = await generateProductQRCode(product.id, validatedData.imei);
                qrCode = await tx.qRCode.create({
                    data: {
                        productId: product.id,
                        code: `PROD_${product.id}_${Date.now()}`,
                        imageData: qrCodeImageData,
                        generatedBy: session.user.id
                    }
                });
            } catch (qrError) {
                console.error("QR code generation failed:", qrError);
                // Create QR code record without image data as fallback
                qrCode = await tx.qRCode.create({
                    data: {
                        productId: product.id,
                        code: `PROD_${product.id}_${Date.now()}`,
                        generatedBy: session.user.id
                    }
                });
            }

            // Create stock movement for initial stock
            if (validatedData.availableStock > 0) {
                await tx.stockMovement.create({
                    data: {
                        productId: product.id,
                        type: 'PURCHASE',
                        quantity: validatedData.availableStock,
                        previousStock: 0,
                        newStock: validatedData.availableStock,
                        reason: 'Stock initial',
                        performedBy: session.user.id
                    }
                });
            }

            // Log the creation
            await tx.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: "CREATE",
                    entity: "Product",
                    entityId: product.id,
                    changes: validatedData
                }
            });

            return { product, qrCode };
        });

        // Revalidate relevant pages
        revalidatePath('/dashboard/products');
        revalidatePath('/api/products');

        return {
            success: true,
            data: result.product,
            message: "Produit créé avec succès"
        };

    } catch (error) {
        console.error('Error creating product:', error);

        if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    fieldErrors[issue.path[0] as string] = issue.message;
                }
            });

            return {
                success: false,
                error: "Données invalides",
                fieldErrors
            };
        }

        return {
            success: false,
            error: "Erreur interne du serveur",
            fieldErrors: null
        };
    }
}

/**
 * Update an existing product
 */
export async function updateProduct(formData: FormData) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return {
                success: false,
                error: "Authentification requise",
                fieldErrors: null
            };
        }

        // Extract form data
        const data = {
            id: formData.get('id') as string,
            name: formData.get('name') as string || undefined,
            brand: formData.get('brand') as string || undefined,
            model: formData.get('model') as string || undefined,
            purchasePrice: formData.get('purchasePrice') ? parseFloat(formData.get('purchasePrice') as string) : undefined,
            sellingPrice: formData.get('sellingPrice') ? parseFloat(formData.get('sellingPrice') as string) : undefined,
            imei: formData.get('imei') as string || undefined,
            availableStock: formData.get('availableStock') ? parseInt(formData.get('availableStock') as string) : undefined,
            minStockLevel: formData.get('minStockLevel') ? parseInt(formData.get('minStockLevel') as string) : undefined,
            description: formData.get('description') as string || undefined,
            category: formData.get('category') as string || undefined,
            status: formData.get('status') as string || undefined
        };

        // Validate data
        const validatedData = updateProductSchema.parse(data);

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: validatedData.id }
        });

        if (!existingProduct) {
            return {
                success: false,
                error: "Produit non trouvé",
                fieldErrors: null
            };
        }

        // Check IMEI uniqueness if IMEI is being updated
        if (validatedData.imei && validatedData.imei !== existingProduct.imei) {
            const duplicateProduct = await prisma.product.findUnique({
                where: { imei: validatedData.imei }
            });

            if (duplicateProduct) {
                return {
                    success: false,
                    error: "Un produit avec cet IMEI existe déjà",
                    fieldErrors: { imei: "Cet IMEI est déjà utilisé" }
                };
            }
        }

        // Update product with transaction
        const result = await prisma.$transaction(async (tx) => {
            // Store previous values for audit log
            const previousData = {
                availableStock: existingProduct.availableStock,
                minStockLevel: existingProduct.minStockLevel
            };

            // Update the product
            const product = await tx.product.update({
                where: { id: validatedData.id },
                data: {
                    ...validatedData,
                    updatedBy: session.user.id
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });

            // Create stock movement if stock has changed
            if (validatedData.availableStock !== undefined &&
                validatedData.availableStock !== previousData.availableStock) {

                const stockChange = validatedData.availableStock - previousData.availableStock;
                const movementType = stockChange > 0 ? 'PURCHASE' : 'ADJUSTMENT';

                await tx.stockMovement.create({
                    data: {
                        productId: product.id,
                        type: movementType,
                        quantity: Math.abs(stockChange),
                        previousStock: previousData.availableStock,
                        newStock: validatedData.availableStock,
                        reason: stockChange > 0 ? 'Ajustement positif' : 'Ajustement négatif',
                        notes: `Stock ajusté de ${previousData.availableStock} à ${validatedData.availableStock}`,
                        performedBy: session.user.id
                    }
                });
            }

            // Log the update
            await tx.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: "UPDATE",
                    entity: "Product",
                    entityId: product.id,
                    changes: {
                        updated: validatedData,
                        previous: previousData
                    }
                }
            });

            return product;
        });

        // Revalidate relevant pages
        revalidatePath('/dashboard/products');
        revalidatePath(`/dashboard/products/${validatedData.id}`);
        revalidatePath('/api/products');

        return {
            success: true,
            data: result,
            message: "Produit mis à jour avec succès"
        };

    } catch (error) {
        console.error('Error updating product:', error);

        if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    fieldErrors[issue.path[0] as string] = issue.message;
                }
            });

            return {
                success: false,
                error: "Données invalides",
                fieldErrors
            };
        }

        return {
            success: false,
            error: "Erreur interne du serveur",
            fieldErrors: null
        };
    }
}

/**
 * Soft delete a product (set status to INACTIVE)
 */
export async function deleteProduct(productId: string) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return {
                success: false,
                error: "Authentification requise"
            };
        }

        // Validate product ID
        if (!productId || typeof productId !== 'string') {
            return {
                success: false,
                error: "ID de produit invalide"
            };
        }

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                sales: {
                    take: 1,
                    select: { id: true }
                }
            }
        });

        if (!existingProduct) {
            return {
                success: false,
                error: "Produit non trouvé"
            };
        }

        // Check if product has sales history
        if (existingProduct.sales.length > 0) {
            return {
                success: false,
                error: "Impossible de supprimer un produit qui a des ventes associées"
            };
        }

        // Check if product is already inactive
        if (existingProduct.status === 'INACTIVE') {
            return {
                success: false,
                error: "Le produit est déjà inactif"
            };
        }

        // Soft delete the product
        const result = await prisma.$transaction(async (tx) => {
            // Update product status to inactive
            const product = await tx.product.update({
                where: { id: productId },
                data: {
                    status: 'INACTIVE',
                    updatedBy: session.user.id
                }
            });

            // Deactivate QR code
            await tx.qRCode.updateMany({
                where: { productId },
                data: { isActive: false }
            });

            // Log the deletion
            await tx.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: "DELETE",
                    entity: "Product",
                    entityId: productId,
                    changes: {
                        status: 'INACTIVE',
                        action: 'Soft delete - Product inactivated'
                    }
                }
            });

            return product;
        });

        // Revalidate relevant pages
        revalidatePath('/dashboard/products');
        revalidatePath('/api/products');

        return {
            success: true,
            data: result,
            message: "Produit supprimé avec succès"
        };

    } catch (error) {
        console.error('Error deleting product:', error);

        return {
            success: false,
            error: "Erreur interne du serveur"
        };
    }
}

/**
 * Adjust product stock
 */
export async function adjustStock(productId: string, newStock: number, reason: string, notes?: string) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return {
                success: false,
                error: "Authentification requise"
            };
        }

        // Validate inputs
        if (!productId || typeof productId !== 'string') {
            return {
                success: false,
                error: "ID de produit invalide"
            };
        }

        if (newStock < 0) {
            return {
                success: false,
                error: "Le stock ne peut pas être négatif"
            };
        }

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return {
                success: false,
                error: "Produit non trouvé"
            };
        }

        // Adjust stock with transaction
        const result = await prisma.$transaction(async (tx) => {
            const previousStock = existingProduct.availableStock;

            // Update product stock
            const product = await tx.product.update({
                where: { id: productId },
                data: {
                    availableStock: newStock,
                    updatedBy: session.user.id
                }
            });

            // Create stock movement record
            await tx.stockMovement.create({
                data: {
                    productId,
                    type: 'ADJUSTMENT',
                    quantity: Math.abs(newStock - previousStock),
                    previousStock,
                    newStock,
                    reason: reason || 'Ajustement manuel',
                    notes,
                    performedBy: session.user.id
                }
            });

            // Create alert if stock is low
            if (newStock > 0 && newStock <= existingProduct.minStockLevel) {
                await tx.stockAlert.create({
                    data: {
                        productId,
                        type: 'LOW_STOCK',
                        threshold: existingProduct.minStockLevel,
                        currentStock: newStock
                    }
                });
            } else if (newStock === 0) {
                await tx.stockAlert.create({
                    data: {
                        productId,
                        type: 'OUT_OF_STOCK',
                        threshold: 0,
                        currentStock: newStock
                    }
                });
            }

            // Log the adjustment
            await tx.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: "ADJUST_STOCK",
                    entity: "Product",
                    entityId: productId,
                    changes: {
                        previousStock,
                        newStock,
                        adjustment: newStock - previousStock,
                        reason,
                        notes
                    }
                }
            });

            return product;
        });

        // Revalidate relevant pages
        revalidatePath('/dashboard/products');
        revalidatePath(`/dashboard/products/${productId}`);
        revalidatePath('/api/products');

        return {
            success: true,
            data: result,
            message: `Stock ajusté de ${existingProduct.availableStock} à ${newStock}`
        };

    } catch (error) {
        console.error('Error adjusting stock:', error);

        return {
            success: false,
            error: "Erreur interne du serveur"
        };
    }
}
