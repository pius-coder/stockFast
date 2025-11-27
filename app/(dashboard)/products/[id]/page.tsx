"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { useProduct } from "@/entities/product/hooks/use-product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2, Package, Barcode, Tag } from "lucide-react";
import { QRCodeDisplay } from "@/entities/product/components/qr-code-display";
import { formatPrice, getCategoryLabel, getStockStatusInfo } from "@/entities/product/lib/product-utils";

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { data: productResponse, isLoading, error } = useProduct(resolvedParams.id);
    const product = productResponse?.data;

    const handleEdit = () => {
        router.push(`/products/${resolvedParams.id}/edit`);
    };

    const handleBack = () => {
        router.push("/products");
    };

    if (isLoading) {
        return (
            <div className="flex-1 space-y-6 p-4 pt-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    if (error || !productResponse?.success || !product) {
        return (
            <div className="flex-1 space-y-6 p-4 pt-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Produit introuvable</h3>
                            <p className="text-muted-foreground mb-4">
                                Le produit que vous recherchez n&apos;existe pas ou a été supprimé.
                            </p>
                            <Button onClick={handleBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour aux produits
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stockStatus = getStockStatusInfo(product.availableStock, product.minStockLevel);

    return (
        <div className="flex-1 space-y-6 p-4 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
                        <p className="text-muted-foreground mt-1">
                            {product.brand} - {product.model}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                    </Button>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Product Info */}
                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Catégorie</span>
                                <Badge variant="outline">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {getCategoryLabel(product.category)}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">IMEI</span>
                                <div className="flex items-center gap-2">
                                    <Barcode className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono text-sm">{product.imei}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Statut</span>
                                <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"}>
                                    {product.status}
                                </Badge>
                            </div>
                            {product.description && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                                    <p className="text-sm">{product.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Prix et marges</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Prix d&apos;achat</span>
                                <span className="font-semibold">{formatPrice(product.purchasePrice)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Prix de vente</span>
                                <span className="font-semibold text-lg">{formatPrice(product.sellingPrice)}</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-sm font-medium text-muted-foreground">Marge bénéficiaire</span>
                                <div className="text-right">
                                    <div className="font-bold text-green-600">
                                        {formatPrice(product.sellingPrice - product.purchasePrice)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {((product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Stock disponible</span>
                                <Badge variant={stockStatus.variant} className="text-lg px-3 py-1">
                                    <Package className="h-4 w-4 mr-2" />
                                    {product.availableStock}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Niveau minimum</span>
                                <span className="font-semibold">{product.minStockLevel}</span>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className={`h-2 w-2 rounded-full ${stockStatus.color}`} />
                                    <span className="font-medium">{stockStatus.label}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - QR Code and Images */}
                <div className="space-y-6">
                    {/* QR Code */}
                    <Card>
                        <CardHeader>
                            <CardTitle>QR Code</CardTitle>
                            <CardDescription>
                                Scannez ce code pour accéder rapidement au produit
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <QRCodeDisplay
                                product={product}
                                qrCode={product.qrCode}
                                showDetails={true}
                            />
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    {product.images && product.images.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {product.images.map((image: string, index: number) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-lg border overflow-hidden relative"
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
