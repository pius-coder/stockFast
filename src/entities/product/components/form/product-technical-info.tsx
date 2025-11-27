"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormField } from "../product-form-field";
import { Control } from "react-hook-form";
import { ProductFormData } from "../../types/product.types";

interface ProductTechnicalInfoProps {
    control: Control<ProductFormData>;
}

export function ProductTechnicalInfo({ control }: ProductTechnicalInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informations techniques</CardTitle>
                <CardDescription>
                    Informations techniques et identification
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ProductFormField
                    config={{
                        name: "imei",
                        label: "IMEI",
                        type: "input",
                        placeholder: "123456789012345",
                        description: "IMEI à 15 chiffres du produit",
                        required: true,
                    }}
                    control={control}
                />

                <ProductFormField
                    config={{
                        name: "status",
                        label: "Statut",
                        type: "select",
                        description: "Statut du produit",
                        required: true,
                        options: [
                            { value: "ACTIVE", label: "Actif" },
                            { value: "INACTIVE", label: "Inactif" },
                            { value: "DISCONTINUED", label: "Discontinué" },
                        ],
                    }}
                    control={control}
                />
            </CardContent>
        </Card>
    );
}
