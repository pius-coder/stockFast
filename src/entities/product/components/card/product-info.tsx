import React from 'react';
import { Product } from '../../types/product.types';
import { calculateProfitMargin, formatPrice } from '../../lib/product-utils';

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    // Calculate profit margin
    const profitMargin = calculateProfitMargin(product.purchasePrice, product.sellingPrice);
    const profitMarginColor = profitMargin >= 30 ? 'text-green-600' : profitMargin >= 15 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="space-y-3">
            {/* Pricing Information */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix d&apos;achat:</span>
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
        </div>
    );
}
