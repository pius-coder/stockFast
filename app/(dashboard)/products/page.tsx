"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductList } from "@/entities/product/components/product-list";
import { ProductStats } from "@/entities/product/components/product-stats";
import { Product } from "@/entities/product/types/product.types";
import { useProducts } from "@/entities/product/hooks/use-products";

export default function ProductsPage() {
    const router = useRouter();
    const [showStats, setShowStats] = useState(true);

    // Fetch all products for stats
    const { data: productsData } = useProducts();

    const handleViewProduct = (product: Product) => {
        router.push(`/products/${product.id}`);
    };

    const handleEditProduct = (product: Product) => {
        router.push(`/products/${product.id}/edit`);
    };

    const handleDeleteProduct = (product: Product) => {
        // Delete confirmation will be handled by ProductCard component
        console.log("Delete product:", product.id);
    };

    const handleCreateProduct = () => {
        router.push("/products/new");
    };

    return (
        <div className="flex-1 space-y-6 p-4 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Produits</h2>
                    <p className="text-muted-foreground mt-1">
                        Gérez votre inventaire de produits
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleCreateProduct}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau Produit
                    </Button>
                </div>
            </div>

            {/* Stats Section */}
            {showStats && (
                <ProductStats
                    products={productsData?.data || []}
                    showTrends={true}
                    showFilters={false}
                />
            )}

            {/* Product List */}
            <ProductList
                onViewProduct={handleViewProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                showStats={false}
                showFilters={true}
                showSearch={true}
                pageSize={20}
            />
        </div>
    );
}
