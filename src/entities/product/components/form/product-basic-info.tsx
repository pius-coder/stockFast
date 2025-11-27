"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormField } from "../product-form-field";
import { Control } from "react-hook-form";
import { ProductCategory, ProductFormData } from "../../types/product.types";

interface ProductBasicInfoProps {
    control: Control<ProductFormData>;
}

export function ProductBasicInfo({ control }: ProductBasicInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                    Informations de base du produit
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ProductFormField
                    config={{
                        name: "name",
                        label: "Nom du produit",
                        type: "input",
                        placeholder: "iPhone 15 Pro",
                        description: "Nom complet du produit",
                        required: true,
                    }}
                    control={control}
                />

                <ProductFormField
                    config={{
                        name: "brand",
                        label: "Marque",
                        type: "input",
                        placeholder: "Apple",
                        description: "Marque du produit",
                        required: true,
                    }}
                    control={control}
                />

                <ProductFormField
                    config={{
                        name: "model",
                        label: "Modèle",
                        type: "input",
                        placeholder: "iPhone 15 Pro",
                        description: "Modèle spécifique du produit",
                        required: true,
                    }}
                    control={control}
                />

                <ProductFormField
                    config={{
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
                    }}
                    control={control}
                />

                <ProductFormField
                    config={{
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        placeholder: "Description détaillée du produit...",
                        description: "Description optionnelle du produit",
                    }}
                    control={control}
                />
            </CardContent>
        </Card>
    );
}
