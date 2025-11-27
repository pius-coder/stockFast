"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { ProductFormField } from "./product-form-field";
import { ImageUpload } from "./image-upload";
import { productSchema } from "./product-form-config";
import { Product, ProductFormData, ProductCategory, ProductStatus } from "../types/product.types";
import { useCreateProduct } from "../hooks/use-create-product";
import { useUpdateProduct } from "../hooks/use-update-product";

interface ProductFormProps {
    product?: Product | null;
    mode?: "create" | "edit";
    onSuccess?: (product: Product) => void;
    onCancel?: () => void;
}

export function ProductForm({
    product = null,
    mode = "create",
    onSuccess,
    onCancel,
}: ProductFormProps) {
    const [images, setImages] = useState<string[]>(product?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Initialize the form with React Hook Form
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || "",
            brand: product?.brand || "",
            model: product?.model || "",
            purchasePrice: product?.purchasePrice.toString() || "",
            sellingPrice: product?.sellingPrice.toString() || "",
            imei: product?.imei || "",
            availableStock: product?.availableStock.toString() || "0",
            minStockLevel: product?.minStockLevel.toString() || "0",
            description: product?.description || "",
            category: product?.category || ProductCategory.PHONE,
            status: product?.status || ProductStatus.ACTIVE,
        },
        mode: "onChange",
    });

    // Get mutation hooks
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const mutation = mode === "create" ? createMutation : updateMutation;

    // Handle form submission
    const handleSubmit = async (values: ProductFormData) => {
        try {
            setIsSubmitting(true);

            const formData = new FormData();
            
            // Add form values
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            // Add images
            images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });

            // Add mode-specific data
            if (mode === "edit" && product?.id) {
                formData.append("id", product.id);
            }

            const result = await mutation.mutateAsync(formData);

            if (result.success) {
                if (onSuccess && result.data) {
                    onSuccess(result.data);
                }
                if (mode === "create") {
                    form.reset();
                    setImages([]);
                }
                toast.success(result.message || "Produit sauvegardé avec succès");
            } else {
                toast.error(result.error || "Erreur lors de la sauvegarde");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Erreur interne du serveur");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle form errors
    const onError = (errors: Record<string, unknown>) => {
        console.error("Form validation errors:", errors);
        toast.error("Veuillez corriger les erreurs dans le formulaire");
    };

    // Handle image changes
    const handleImageChange = (newImages: string[]) => {
        setImages(newImages);
    };

    // Handle cancel action
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };

    // Calculate profit margin
    const purchasePrice = parseFloat(form.watch("purchasePrice") || "0");
    const sellingPrice = parseFloat(form.watch("sellingPrice") || "0");
    const profitMargin = purchasePrice > 0 ? ((sellingPrice - purchasePrice) / purchasePrice) * 100 : 0;

    // Stock status
    const availableStock = parseInt(form.watch("availableStock") || "0");
    const minStockLevel = parseInt(form.watch("minStockLevel") || "0");
    const isStockLow = availableStock > 0 && availableStock <= minStockLevel;
    const isOutOfStock = availableStock === 0;

    return (
        <div className="min-h-screen relative p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSubmitting || mutation.isPending}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {mode === "create" ? "Créer un nouveau produit" : "Modifier le produit"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {mode === "create"
                            ? "Ajoutez un nouveau produit à votre inventaire"
                            : `Modification de ${product?.name}`}
                    </p>
                </div>
            </div>

            {/* Form */}
            <Form {...form}>
                <form
                    id="product-form"
                    onSubmit={form.handleSubmit(handleSubmit, onError)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Basic Information */}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
                                />
                            </CardContent>
                        </Card>

                        {/* Right Column - Pricing and Stock */}
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
                                    control={form.control}
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
                                    control={form.control}
                                />

                                {/* Profit Margin Display */}
                                {purchasePrice > 0 && sellingPrice > 0 && (
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Marge bénéficiaire:</span>
                                            <span
                                                className={`text-sm font-bold ${
                                                    profitMargin > 0 ? "text-green-600" : "text-red-600"
                                                }`}
                                            >
                                                {profitMargin.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {((sellingPrice - purchasePrice)).toLocaleString()} FCFA de gain
                                        </div>
                                    </div>
                                )}

                                <ProductFormField
                                    config={{
                                        name: "imei",
                                        label: "IMEI",
                                        type: "imei",
                                        placeholder: "123456789012345",
                                        description: "Numéro IMEI du produit (15 chiffres)",
                                        required: true,
                                    }}
                                    control={form.control}
                                />

                                <ProductFormField
                                    config={{
                                        name: "availableStock",
                                        label: "Stock disponible",
                                        type: "number",
                                        placeholder: "10",
                                        description: "Quantité en stock",
                                        required: true,
                                    }}
                                    control={form.control}
                                />

                                <ProductFormField
                                    config={{
                                        name: "minStockLevel",
                                        label: "Niveau de stock minimum",
                                        type: "number",
                                        placeholder: "5",
                                        description: "Seuil d'alerte de stock",
                                        required: true,
                                    }}
                                    control={form.control}
                                />

                                {/* Stock Status Display */}
                                {(availableStock > 0 || minStockLevel > 0) && (
                                    <div className="p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Statut du stock:</span>
                                            <span
                                                className={`text-sm font-bold px-2 py-1 rounded ${
                                                    isOutOfStock
                                                        ? "bg-red-100 text-red-800"
                                                        : isStockLow
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {isOutOfStock
                                                    ? "Rupture de stock"
                                                    : isStockLow
                                                    ? "Stock faible"
                                                    : "Stock normal"}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <ProductFormField
                                    config={{
                                        name: "status",
                                        label: "Statut",
                                        type: "select",
                                        description: "Statut du produit",
                                        options: [
                                            { value: ProductStatus.ACTIVE, label: "Actif" },
                                            { value: ProductStatus.INACTIVE, label: "Inactif" },
                                            { value: ProductStatus.DISCONTINUED, label: "Arrêté" },
                                        ],
                                    }}
                                    control={form.control}
                                />
                            </CardContent>
                        </Card>
                   
                    {/* Additional Info and Images Section */}
                    <div className="space-y-6">
                        {/* Third Column - Additional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations supplémentaires</CardTitle>
                                <CardDescription>
                                    Autres détails du produit
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ProductFormField
                                    config={{
                                        name: "description",
                                        label: "Description",
                                        type: "textarea",
                                        placeholder: "Description détaillée du produit...",
                                        description: "Description optionnelle du produit",
                                    }}
                                    control={form.control}
                                />
                            </CardContent>
                        </Card>

                        {/* Image Upload Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Images du produit</CardTitle>
                                <CardDescription>
                                    Ajoutez des images pour présenter votre produit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUpload
                                    value={images}
                                    onChange={handleImageChange}
                                    maxImages={5}
                                    maxSizeMB={5}
                                    disabled={isSubmitting || mutation.isPending}
                                />
                            </CardContent>
                        </Card>
                    </div>
                     </div>


                    {/* Form Actions - Fixed Bottom Right */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <div className="bg-background border rounded-lg shadow-lg p-3 space-x-2 flex items-center">
                            {isSubmitting || mutation.isPending ? (
                                <div className="flex items-center space-x-2 text-muted-foreground pr-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Sauvegarde...</span>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isSubmitting || mutation.isPending}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isSubmitting || mutation.isPending}
                                    >
                                        {isSubmitting || mutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                {mode === "create" ? "Création..." : "Mise à jour..."}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {mode === "create" ? "Créer" : "Mettre à jour"}
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Add padding at bottom to avoid content being hidden behind fixed buttons */}
                    <div className="h-20"></div>
                </form>
            </Form>
        </div>
    );
}
