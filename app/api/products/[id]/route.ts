import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/lib/auth";

// GET /api/products/[id] - Retrieve single product by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Authentification requise" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Validate ID format
        if (!id || typeof id !== 'string') {
            return NextResponse.json(
                { success: false, error: "ID de produit invalide" },
                { status: 400 }
            );
        }

        // Get product by ID with relations
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                qrCode: {
                    select: {
                        id: true,
                        code: true,
                        imageData: true,
                        imageUrl: true,
                        isActive: true,
                        generatedAt: true
                    }
                },
                stockMovements: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        type: true,
                        quantity: true,
                        previousStock: true,
                        newStock: true,
                        reason: true,
                        notes: true,
                        performedBy: true,
                        createdAt: true,
                        performer: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                alerts: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        type: true,
                        threshold: true,
                        currentStock: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Produit non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Error fetching product:', error);

        return NextResponse.json(
            { success: false, error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
