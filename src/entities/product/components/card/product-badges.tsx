import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Product } from '../../types/product.types';
import { getCategoryLabel, getStockStatusInfo } from '../../lib/product-utils';

interface ProductBadgesProps {
    product: Product;
}

export function ProductBadges({ product }: ProductBadgesProps) {
    const stockStatusInfo = getStockStatusInfo(product.availableStock, product.minStockLevel);
    const StockIcon = stockStatusInfo.icon;

    return (
        <div className="flex flex-col gap-1 ml-2">
            <Badge variant="secondary" size="sm">
                {getCategoryLabel(product.category)}
            </Badge>
            <Badge
                variant={stockStatusInfo.variant === 'success' ? 'default' : stockStatusInfo.variant === 'warning' ? 'secondary' : 'destructive'}
                size="sm"
                className={`flex items-center gap-1 ${stockStatusInfo.variant === 'success' ? 'bg-green-600 hover:bg-green-700' : stockStatusInfo.variant === 'warning' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
            >
                <StockIcon className="h-3 w-3" />
                {stockStatusInfo.label}
            </Badge>
        </div>
    );
}
