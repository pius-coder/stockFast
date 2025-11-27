import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollapsibleFilters } from './collapsible-filters';

interface PriceRangeFilterProps {
    minPrice: number | undefined;
    maxPrice: number | undefined;
    onMinPriceChange: (price: number | undefined) => void;
    onMaxPriceChange: (price: number | undefined) => void;
    className?: string;
}

// Format price for display
const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export function PriceRangeFilter({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    className
}: PriceRangeFilterProps) {
    const handleMinPriceChange = (value: string) => {
        const price = parseFloat(value) || 0;
        onMinPriceChange(price > 0 ? price : undefined);
    };

    const handleMaxPriceChange = (value: string) => {
        const price = parseFloat(value) || 0;
        onMaxPriceChange(price > 0 ? price : undefined);
    };

    const clearPriceRange = () => {
        onMinPriceChange(undefined);
        onMaxPriceChange(undefined);
    };

    const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;

    return (
        <CollapsibleFilters title="Gamme de prix" defaultOpen={false} className={className}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Prix minimum
                        </label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={minPrice || ''}
                            onChange={(e) => handleMinPriceChange(e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Prix maximum
                        </label>
                        <Input
                            type="number"
                            placeholder="Illimité"
                            value={maxPrice || ''}
                            onChange={(e) => handleMaxPriceChange(e.target.value)}
                            className="text-sm"
                        />
                    </div>
                </div>

                {hasPriceFilter && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-600">
                            {minPrice && maxPrice
                                ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                                : minPrice
                                    ? `À partir de ${formatPrice(minPrice)}`
                                    : maxPrice
                                        ? `Jusqu'à ${formatPrice(maxPrice)}`
                                        : ''
                            }
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearPriceRange}
                            className="h-6 px-2 text-xs"
                        >
                            Effacer
                        </Button>
                    </div>
                )}
            </div>
        </CollapsibleFilters>
    );
}
