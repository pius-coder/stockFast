import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Advanced search validation schema
const advancedSearchSchema = z.object({
    query: z.string().optional(),
    category: z.enum(['PHONE', 'ACCESSORY', 'COMPONENT']).optional(),
    brand: z.string().optional(),
    priceMin: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    priceMax: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
    sortBy: z.enum(['name', 'brand', 'sellingPrice', 'availableStock', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().transform(val => val || 'asc'),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
    exactMatch: z.string().optional().transform(val => val === 'true'),
    includeInactive: z.string().optional().transform(val => val === 'true')
});

// GET /api/products/search - Advanced search with multiple filters
export async function GET(request: Request) {
    try {
        // Check authentication
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Authentification requise" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const queryData = Object.fromEntries(searchParams.entries());

        // Parse and validate search parameters
        const validatedParams = advancedSearchSchema.parse(queryData);

        const {
            query,
            category,
            brand,
            priceMin,
            priceMax,
            stockStatus,
            sortBy,
            sortOrder,
            page,
            limit,
            exactMatch,
            includeInactive
        } = validatedParams;

        // Build where clause for advanced search
        const where: Prisma.ProductWhereInput = {};

        // Full-text search across multiple fields
        if (query && exactMatch) {
            // Exact match search
            where.OR = [
                { name: { equals: query } },
                { brand: { equals: query } },
                { model: { equals: query } },
                { imei: { equals: query } }
            ];
        } else if (query) {
            // Partial match search with higher relevance
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { brand: { contains: query, mode: 'insensitive' } },
                { model: { contains: query, mode: 'insensitive' } },
                { imei: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
            ];
        }

        // Brand filter
        if (brand) {
            where.brand = { contains: brand, mode: 'insensitive' };
        }

        // Category filter
        if (category) {
            where.category = category;
        }

        // Include inactive products if requested
        if (!includeInactive) {
            where.status = 'ACTIVE';
        }

        // Price range filter
        if (priceMin !== undefined || priceMax !== undefined) {
            where.sellingPrice = {};
            if (priceMin !== undefined) {
                where.sellingPrice.gte = priceMin;
            }
            if (priceMax !== undefined) {
                where.sellingPrice.lte = priceMax;
            }
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build order by clause
        const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

        // Add the main sort criteria
        const sortCriteria: Prisma.ProductOrderByWithRelationInput = {};
        if (sortBy) {
            sortCriteria[sortBy] = sortOrder;
        } else {
            // Default sorting based on whether there's a search query
            sortCriteria.createdAt = 'desc';
        }
        orderBy.push(sortCriteria);

        // Execute search query
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

        // Handle stock status filtering that can't be done in Prisma
        let filteredProducts = products;
        if (stockStatus) {
            switch (stockStatus) {
                case 'in_stock':
                    filteredProducts = products.filter(p => p.availableStock > 0);
                    break;
                case 'low_stock':
                    filteredProducts = products.filter(p =>
                        p.availableStock > 0 && p.availableStock <= p.minStockLevel
                    );
                    break;
                case 'out_of_stock':
                    filteredProducts = products.filter(p => p.availableStock === 0);
                    break;
            }
        }

        // Add search metadata if performing text search
        const searchMetadata = query ? {
            query,
            exactMatch,
            resultsFound: filteredProducts.length,
            searchTime: Date.now()
        } : undefined;

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            success: true,
            data: filteredProducts,
            pagination: {
                page,
                limit,
                total: filteredProducts.length,
                totalPages
            },
            search: searchMetadata
        });

    } catch (error) {
        console.error('Error in advanced search:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Paramètres de recherche invalides",
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
