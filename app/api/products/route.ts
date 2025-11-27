import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Validation schema for query parameters
const querySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    search: z.string().optional(),
    category: z.enum(['PHONE', 'ACCESSORY', 'COMPONENT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']).optional(),
    minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
    sortBy: z.enum(['name', 'brand', 'sellingPrice', 'availableStock', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().transform(val => val || 'asc')
});

// GET /api/products - List products with pagination, search, and filters
export async function GET(request: Request) {
    try {
        // Check authentication - BetterAuth needs the request object, not just headers

        const session = await auth.api.getSession({
            headers: request.headers
        });


        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Authentification requise" },
                { status: 401 }
            );
        }


        const { searchParams } = new URL(request.url);
        const queryData = Object.fromEntries(searchParams.entries());

        // Parse and validate query parameters
        const validatedQuery = querySchema.parse(queryData);

        const {
            page,
            limit,
            search,
            category,
            status,
            minPrice,
            maxPrice,
            stockStatus,
            sortBy,
            sortOrder
        } = validatedQuery;

        // Build where clause
        const where: Prisma.ProductWhereInput = {};

        // Text search
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
                { imei: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Category filter
        if (category) {
            where.category = category;
        }

        // Status filter
        if (status) {
            where.status = status;
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.sellingPrice = {};
            if (minPrice !== undefined) {
                where.sellingPrice.gte = minPrice;
            }
            if (maxPrice !== undefined) {
                where.sellingPrice.lte = maxPrice;
            }
        }

        // Stock status filter
        if (stockStatus) {
            switch (stockStatus) {
                case 'in_stock':
                    where.availableStock = { gt: 0 };
                    break;
                case 'low_stock':
                    // This will be handled in JavaScript as Prisma doesn't support field-to-field comparison
                    break;
                case 'out_of_stock':
                    where.availableStock = 0;
                    break;
            }
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build order by clause
        const orderBy: Prisma.ProductOrderByWithRelationInput = {};
        if (sortBy) {
            orderBy[sortBy] = sortOrder;
        } else {
            orderBy.createdAt = 'desc'; // Default sort
        }

        // Get products with pagination
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
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
                            imageUrl: true
                        }
                    }
                }
            }),
            prisma.product.count({ where })
        ]);

        // Handle low stock filter if present
        let filteredProducts = products;
        if (stockStatus === 'low_stock') {
            filteredProducts = products.filter(product =>
                product.availableStock > 0 && product.availableStock <= product.minStockLevel
            );
        }

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            success: true,
            data: filteredProducts,
            pagination: {
                page,
                limit,
                total: filteredProducts.length,
                totalPages
            }
        });

    } catch (error) {
        console.error('Error fetching products:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Paramètres de requête invalides",
                    details: error.issues
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
