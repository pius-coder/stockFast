"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductFormField } from "../product-form-field";
import { Control } from "react-hook-form";
import { ProductFormData } from "../../types/product.types";

interface ProductPricingStockProps {
    control: Control<ProductFormData>;
    profitMargin: number;
    isStockLow: boolean;
    isOutOfStock: boolean;
}

export function ProductPricingStock({
    control,
    profitMargin,
    isStockLow,
    isOutOfStock,
}: ProductPricingStockProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Prix et stock</CardTitle>
                <CardDescription>
                    Informations de prix et de stock
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ProductFormField
                    config={{
                        name: "purchasePrice",
                        label: "Prix d'achat (FCFA)",
                        type: "number",
                        placeholder: "500000",
                        description: "Prix d'achat en francs CFA",
                        required: true,
                    }}
                    control={control}
                />

                <ProductFormField
                    config={{
                        name: "sellingPrice",
                        label: "Prix de vente (FCFA)",
                        type: "number",
                        placeholder: "650000",
                        description: "Prix de vente en francs CFA",
                        required: true,
                    }}
                    control={control}
                />

                {/* Profit Margin Display */}
                {profitMargin > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">
                                Marge de profit estimée
                            </span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {profitMargin.toFixed(1)}%
                            </Badge>
                        </div>
                    </div>
                )}

                <ProductFormField
                    config={{
                        name: "availableStock",
                        label: "Stock disponible",
                        type: "number",
                        placeholder: "10",
                        description: "Quantité actuellement en stock",
                        required: true,
                    }}
                    control={control}
                />

                <ProductFormField
                    config={{
                        name: "minStockLevel",
                        label: "Stock minimum",
                        type: "number",
                        placeholder: "5",
                        description: "Niveau de stock pour alerte",
                        required: true,
                    }}
                    control={control}
                />

                {/* Stock Status Display */}
                {(isStockLow || isOutOfStock) && (
                    <div className={`p-3 border rounded-lg ${
                        isOutOfStock 
                            ? "bg-red-50 border-red-200" 
                            : "bg-yellow-50 border-yellow-200"
                    }`}>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${
                                isOutOfStock ? "text-red-800" : "text-yellow-800"
                            }`}>
                                {isOutOfStock ? "Stock épuisé" : "Stock faible"}
                            </span>
                            <Badge 
                                variant="secondary" 
                                className={
                                    isOutOfStock 
                                        ? "bg-red-100 text-red-800" 
                                        : "bg-yellow-100 text-yellow-800"
                                }
                            >
                                {isOutOfStock ? "0 unités" : "Alerte stock"}
                            </Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
