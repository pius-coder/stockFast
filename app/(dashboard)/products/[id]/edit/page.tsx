"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useProduct } from "@/entities/product/hooks/use-product";
import { ProductForm } from "@/entities/product/components/product-form";
import { Product } from "@/entities/product/types/product.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { data: productResponse, isLoading, error } = useProduct(resolvedParams.id);
    const product = productResponse?.data;

    const handleSuccess = (updatedProduct: Product) => {
        // Navigate to the product detail page after successful update
        router.push(`/products/${updatedProduct.id}`);
    };

    const handleCancel = () => {
        // Navigate back to product detail page
        router.push(`/products/${resolvedParams.id}`);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    if (error || !productResponse?.success || !product) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                            <p className="text-muted-foreground mb-4">
                                Impossible de charger le produit. Il n&apos;existe peut-être plus.
                            </p>
                            <Button onClick={() => router.push("/products")}>
                                Retour aux produits
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <ProductForm
            product={product}
            mode="edit"
            onSuccess={handleSuccess}
            onCancel={handleCancel}
        />
    );
}
