// ============================================================================
// PRODUCT TYPES
// Type definitions for the Product Management system
// ============================================================================

import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export enum ProductCategory {
    PHONE = "PHONE",
    ACCESSORY = "ACCESSORY",
    COMPONENT = "COMPONENT",
}

export enum ProductStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DISCONTINUED = "DISCONTINUED",
}

export enum StockMovementType {
    IN = "IN",
    OUT = "OUT",
    ADJUSTMENT = "ADJUSTMENT",
    SALE = "SALE",
    PURCHASE = "PURCHASE",
    RETURN = "RETURN",
    DAMAGE = "DAMAGE",
}

// ============================================================================
// CORE PRODUCT TYPES
// ============================================================================

export interface Product {
    id: string;
    name: string;
    brand: string;
    model: string;
    purchasePrice: number;
    sellingPrice: number;
    imei: string;
    availableStock: number;
    minStockLevel: number;
    description?: string;
    images: string[];
    category: ProductCategory;
    status: ProductStatus;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    creator?: {
        id: string;
        name: string;
        email: string;
    };
    qrCode?: {
        id: string;
        code: string;
        imageData?: string;
        imageUrl?: string;
        generatedAt: Date;
    };
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface ProductFormData {
    name: string;
    brand: string;
    model: string;
    purchasePrice: string; // String for form input
    sellingPrice: string; // String for form input
    imei: string;
    availableStock: string; // String for form input
    minStockLevel: string; // String for form input
    description?: string;
    images?: FileList | null;
    category: ProductCategory;
    status?: ProductStatus;
}

export interface ProductEditFormData extends ProductFormData {
    id: string;
    existingImages?: string[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ProductApiResponse {
    success: boolean;
    data?: Product;
    error?: string;
    message?: string;
}

export interface ProductListApiResponse {
    success: boolean;
    data?: Product[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
    message?: string;
}

export interface ProductStats {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalValue: number;
    categoryBreakdown: {
        [key in ProductCategory]: number;
    };
}

// ============================================================================
// SEARCH AND FILTER TYPES
// ============================================================================

export interface ProductSearchFilters {
    query?: string;
    category?: ProductCategory;
    status?: ProductStatus;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    priceMin?: number; // Alias for minPrice
    priceMax?: number; // Alias for maxPrice
    minStock?: number;
    maxStock?: number;
    stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
    lowStock?: boolean;
    outOfStock?: boolean;
    exactMatch?: boolean;
    includeInactive?: boolean;
}

export interface ProductSortOptions {
    field: 'name' | 'brand' | 'sellingPrice' | 'availableStock' | 'createdAt' | 'updatedAt';
    direction: 'asc' | 'desc';
}

export interface ProductPaginationOptions {
    page: number;
    limit: number;
    total?: number;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProductSearchParams extends ProductSearchFilters, ProductSortOptions, ProductPaginationOptions { }

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

export type ProductFormFieldType =
    | 'text'
    | 'number'
    | 'email'
    | 'textarea'
    | 'select'
    | 'file'
    | 'image-upload';

export interface ProductFormFieldConfig {
    name: keyof ProductFormData;
    label: string;
    type: ProductFormFieldType;
    placeholder?: string;
    description?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    accept?: string; // For file inputs
    multiple?: boolean; // For file inputs
}

// ============================================================================
// STOCK MANAGEMENT TYPES
// ============================================================================

export interface StockAlert {
    id: string;
    productId: string;
    type: 'LOW_STOCK' | 'OUT_OF_STOCK';
    threshold: number;
    currentStock: number;
    isActive: boolean;
    createdAt: Date;
}

export interface StockMovement {
    id: string;
    productId: string;
    type: StockMovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason?: string;
    notes?: string;
    performedBy: string;
    createdAt: Date;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ProductSummary = Pick<Product, 'id' | 'name' | 'brand' | 'model' | 'sellingPrice' | 'availableStock' | 'category' | 'status'>;

export interface ProductOption {
    value: string;
    label: string;
    product: ProductSummary;
}

// ============================================================================
// ZOD SCHEMAS FOR TYPE INFERENCE
// ============================================================================

// This will be imported and used in the config file
export const ProductCategoryEnum = z.nativeEnum(ProductCategory);
export const ProductStatusEnum = z.nativeEnum(ProductStatus);

export type ProductCategoryType = z.infer<typeof ProductCategoryEnum>;
export type ProductStatusType = z.infer<typeof ProductStatusEnum>;