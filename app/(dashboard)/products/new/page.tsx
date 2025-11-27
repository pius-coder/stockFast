"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/entities/product/components/product-form";
import { Product } from "@/entities/product/types/product.types";

export default function NewProductPage() {
    const router = useRouter();

    const handleSuccess = (product: Product) => {
        // Navigate to the product detail page after successful creation
        router.push(`/products/${product.id}`);
    };

    const handleCancel = () => {
        // Navigate back to products list
        router.push("/products");
    };

    return (
        <ProductForm
            mode="create"
            onSuccess={handleSuccess}
            onCancel={handleCancel}
        />
    );
}
