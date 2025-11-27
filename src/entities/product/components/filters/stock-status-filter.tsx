import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CollapsibleFilters } from './collapsible-filters';

// Stock status options
const stockStatusOptions = [
    { value: 'all', label: 'Tous les stocks', count: 0 },
    { value: 'in_stock', label: 'En stock', count: 0 },
    { value: 'low_stock', label: 'Stock faible', count: 0 },
    { value: 'out_of_stock', label: 'Rupture de stock', count: 0 },
];

interface StockStatusFilterProps {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    className?: string;
}

export function StockStatusFilter({ selectedStatus, onStatusChange, className }: StockStatusFilterProps) {
    return (
        <CollapsibleFilters title="État du stock" defaultOpen={false} className={className}>
            <div className="space-y-2">
                {stockStatusOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="stockStatus"
                            value={option.value}
                            checked={selectedStatus === option.value}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                        {option.count > 0 && (
                            <Badge variant="secondary" size="sm">
                                {option.count}
                            </Badge>
                        )}
                    </label>
                ))}
            </div>
        </CollapsibleFilters>
    );
}
