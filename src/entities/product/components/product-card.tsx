import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '../types/product.types';
import {
    ProductImage,
    ProductInfo,
    ProductActions,
    ProductBadges,
    ProductCardSkeleton
} from './card';

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
// MAIN PRODUCT CARD COMPONENT
// ============================================================================

export function ProductCard({
    product,
    onView,
    onEdit,
    onDelete,
    isLoading = false,
    className
}: ProductCardProps) {
    // Handle card click for navigation
    const handleCardClick = () => {
        if (onView) {
            onView(product);
        }
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
                    <ProductBadges product={product} />
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Product Image */}
                <ProductImage product={product} />

                {/* Product Info (Price, Stock Level) */}
                <ProductInfo product={product} />
            </CardContent>

            <CardFooter className="gap-2 pt-2">
                {/* Action Buttons */}
                <ProductActions
                    product={product}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </CardFooter>
        </Card>
    );
}

export default ProductCard;
