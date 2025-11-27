import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollapsibleFilters } from './collapsible-filters';

interface BrandFilterProps {
    selectedBrand: string;
    availableBrands: string[];
    onBrandChange: (brand: string) => void;
    className?: string;
}

export function BrandFilter({ selectedBrand, availableBrands, onBrandChange, className }: BrandFilterProps) {
    const clearBrand = () => {
        onBrandChange('');
    };

    const handleChange = (value: string) => {
        // Convert 'all' to empty string for the parent component
        onBrandChange(value === 'all' ? '' : value);
    };

    return (
        <CollapsibleFilters title="Marque" defaultOpen={false} className={className}>
            <div className="space-y-3">
                <Select value={selectedBrand || 'all'} onValueChange={handleChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les marques</SelectItem>
                        {availableBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                                {brand}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedBrand && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <Badge variant="outline" className="text-xs">
                            {selectedBrand}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearBrand}
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
