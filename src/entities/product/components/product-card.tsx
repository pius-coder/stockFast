// ============================================================================
// PRODUCT CARD COMPONENT
// Individual product display card with comprehensive functionality
// ============================================================================

import React from 'react';
import React, { useState }
import {
    Eye,
    Edit,
    Trash2,
    Package,
    AlertTriangle,
    CheckCircle,
    Image as ImageIcon
    QrCode,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '../types/product.types';
import { QRCodePreview } from './qr-code-display';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateProfitMargin = (purchasePrice: number, sellingPrice: number): number => {
    if (purchasePrice === 0) return 0;
    return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
};

const getStockStatusInfo = (availableStock: number, minStockLevel: number) => {
    if (availableStock === 0) {
        return {
            status: 'out_of_stock' as const,
            label: 'Rupture de stock',
            icon: AlertTriangle,
            variant: 'destructive' as const,
            color: 'text-red-600'
        };
    } else if (availableStock <= minStockLevel) {
        return {
            status: 'low_stock' as const,
            label: 'Stock faible',
            icon: AlertTriangle,
            variant: 'warning' as const,
            color: 'text-orange-600'
        };
    } else {
        return {
            status: 'in_stock' as const,
            label: 'En stock',
            icon: CheckCircle,
            variant: 'success' as const,
            color: 'text-green-600'
        };
    }
};

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const getCategoryLabel = (category: string): string => {
    const categoryMap = {
        'PHONE': 'Téléphone',
        'ACCESSORY': 'Accessoire',
        'COMPONENT': 'Composant'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
};

// ============================================================================
// PRODUCT CARD PROPS
// ============================================================================

interface ProductCardProps {
    product: Product;
    onView?: (product: Product) => void;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    isLoading?: boolean;
    className?: string;
}

// ============================================================================
// PRODUCT CARD SKELETON
// ============================================================================

interface ProductCardSkeletonProps {
    className?: string;
}

function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
    return (
        <Card className={className}>
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-1">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-32 w-full rounded-md" />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
            </CardFooter>
        </Card>
    );
}

// ============================================================================
// MAIN PRODUCT CARD COMPONENT
// ============================================================================

export function ProductCard({
    const [showQRCode, setShowQRCode] = useState(false);
    product,
    onView,
    onEdit,
    onDelete,
    isLoading = false,
    className
}: ProductCardProps) {
    // Calculate profit margin
    const profitMargin = calculateProfitMargin(product.purchasePrice, product.sellingPrice);
    const profitMarginColor = profitMargin >= 30 ? 'text-green-600' : profitMargin >= 15 ? 'text-yellow-600' : 'text-red-600';

    // Get stock status information
    const stockStatusInfo = getStockStatusInfo(product.availableStock, product.minStockLevel);
    const StockIcon = stockStatusInfo.icon;

    // Handle card click for navigation
    const handleCardClick = () => {
        if (onView) {
            onView(product);
        }
    };

    // Handle action button clicks (prevent event bubbling)
    const handleActionClick = (action: (product: Product) => void, event: React.MouseEvent) => {
        event.stopPropagation();
        action(product);
    };

    if (isLoading) {
        return <ProductCardSkeleton className={className} />;
    }

    return (
        <Card
            className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${className}`}
            onClick={handleCardClick}
        >
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                            {product.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            {product.brand} • {product.model}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                            IMEI: {product.imei}
                        </p>
                    </div>

                    {/* Category and Stock Status Badges */}
                    <div className="flex flex-col gap-1 ml-2">
                        <Badge variant="info" size="sm">
                            {getCategoryLabel(product.category)}
                        </Badge>
                        <Badge
                            variant={stockStatusInfo.variant}
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <StockIcon className="h-3 w-3" />
                            {stockStatusInfo.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Product Image */}
                <div className="relative">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={`${product.name} - ${product.brand}`}
                            className="w-full h-32 object-cover rounded-md bg-gray-100"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-product.png';
                            }}
                        />
                    ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                    )}

                    {/* Stock Count Overlay */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Package className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">
                            {product.availableStock}
                        </span>
                    </div>
                </div>

                {/* Pricing Information */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prix d'achat:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {formatPrice(product.purchasePrice)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prix de vente:</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(product.sellingPrice)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Marge:</span>
                        <span className={`text-sm font-semibold ${profitMarginColor}`}>
                            {profitMargin.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Stock Level Indicator */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Seuil minimum:</span>
                        <span>{product.minStockLevel}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${product.availableStock === 0
                                    ? 'bg-red-500'
                                    : product.availableStock <= product.minStockLevel
                                        ? 'bg-orange-500'
                                        : 'bg-green-500'
                                }`}
                            style={{
                                width: `${Math.min((product.availableStock / (product.minStockLevel * 2)) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="gap-2 pt-2">
                {/* View Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => handleActionClick(onView || (() => { }), e)}
                    disabled={!onView}
                    aria-label={`Voir les détails de ${product.name}`}
                >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                </Button>

                {/* Edit Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleActionClick(onEdit || (() => { }), e)}
                    disabled={!onEdit}
                    aria-label={`Modifier ${product.name}`}
                >
                    <Edit className="h-4 w-4" />
                </Button>

                {/* Delete Button */}
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                {/* QR Code Button */}
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                <Button
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                    variant="outline"
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                    size="sm"
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                    onClick={(e) => {
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                        event.stopPropagation();
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                        setShowQRCode(!showQRCode);
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                    }}
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                    aria-label="Afficher le code QR"
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                >
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                    <QrCode className="h-4 w-4" />
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                </Button>
                {/* QR Code Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowQRCode(!showQRCode);
                    }}
                    aria-label="Afficher le code QR"
                >
                    <QrCode className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleActionClick(onDelete || (() => { }), e)}
                    disabled={!onDelete}
                    className="text-destructive hover:text-destructive"
                    aria-label={`Supprimer ${product.name}`}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ProductCard;