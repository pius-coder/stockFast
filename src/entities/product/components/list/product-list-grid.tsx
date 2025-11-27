"use client";

import { ProductCard } from "../product-card";
import { Product } from "../../types/product.types";

interface ProductListGridProps {
    products: Product[];
    viewMode: "grid" | "list";
    onViewProduct: (product: Product) => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (product: Product) => void;
    isLoading: boolean;
}

export function ProductListGrid({
    products,
    viewMode,
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
    isLoading,
}: ProductListGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="h-64 bg-gray-100 animate-pulse rounded-lg"
                    />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-muted-foreground">
                    Aucun produit trouvé
                </div>
            </div>
        );
    }

    const gridClass = viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4";

    return (
        <div className={gridClass}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onView={onViewProduct}
                    onEdit={onEditProduct}
                    onDelete={onDeleteProduct}
                />
            ))}
        </div>
    );
}
