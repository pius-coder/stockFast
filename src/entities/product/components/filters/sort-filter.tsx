import React from 'react';
import { SortAsc, SortDesc } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollapsibleFilters } from './collapsible-filters';
import { ProductSortOptions } from '../../types/product.types';

// Sort options
const sortOptions = [
    {
        value: 'name_asc',
        label: 'Nom (A-Z)',
        field: 'name' as const,
        direction: 'asc' as const
    },
    {
        value: 'name_desc',
        label: 'Nom (Z-A)',
        field: 'name' as const,
        direction: 'desc' as const
    },
    {
        value: 'price_asc',
        label: 'Prix croissant',
        field: 'sellingPrice' as const,
        direction: 'asc' as const
    },
    {
        value: 'price_desc',
        label: 'Prix décroissant',
        field: 'sellingPrice' as const,
        direction: 'desc' as const
    },
    {
        value: 'stock_desc',
        label: 'Stock décroissant',
        field: 'availableStock' as const,
        direction: 'desc' as const
    },
    {
        value: 'stock_asc',
        label: 'Stock croissant',
        field: 'availableStock' as const,
        direction: 'asc' as const
    },
    {
        value: 'created_desc',
        label: 'Plus récents',
        field: 'createdAt' as const,
        direction: 'desc' as const
    },
    {
        value: 'created_asc',
        label: 'Plus anciens',
        field: 'createdAt' as const,
        direction: 'asc' as const
    },
];

interface SortFilterProps {
    sortOption: ProductSortOptions;
    onSortChange: (sort: ProductSortOptions) => void;
    className?: string;
}

export function SortFilter({ sortOption, onSortChange, className }: SortFilterProps) {
    const handleSortChange = (value: string) => {
        const option = sortOptions.find(opt => opt.value === value);
        if (option) {
            onSortChange({
                field: option.field,
                direction: option.direction,
            });
        }
    };

    // Find current sort option
    const currentSortOption = sortOptions.find(
        opt => opt.field === sortOption.field && opt.direction === sortOption.direction
    );

    return (
        <CollapsibleFilters title="Trier par" defaultOpen={false} className={className}>
            <Select
                value={currentSortOption?.value || ''}
                onValueChange={handleSortChange}
            >
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                                {option.direction === 'asc' ? (
                                    <SortAsc className="h-3 w-3" />
                                ) : (
                                    <SortDesc className="h-3 w-3" />
                                )}
                                {option.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </CollapsibleFilters>
    );
}
