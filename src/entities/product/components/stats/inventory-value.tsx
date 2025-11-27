import React from 'react';
import { DollarSign, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '../../lib/product-utils';

interface InventoryValueProps {
    totalValue: number;
    averagePrice: number;
    change?: {
        value: number;
        type: 'increase' | 'decrease' | 'neutral';
    };
    className?: string;
    loading?: boolean;
}

export function InventoryValue({
    totalValue,
    averagePrice,
    change,
    className,
    loading = false
}: InventoryValueProps) {
    if (loading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Valeur d&apos;inventaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-24" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valeur d&apos;inventaire
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(totalValue)}
                    </span>
                    {change && (
                        <Badge variant="secondary" className={
                            change.type === 'increase' ? 'text-green-600 bg-green-100' :
                                change.type === 'decrease' ? 'text-red-600 bg-red-100' :
                                    'text-gray-600 bg-gray-100'
                        }>
                            <div className="flex items-center gap-1">
                                {change.type === 'increase' ? <ArrowUp className="h-3 w-3" /> :
                                    change.type === 'decrease' ? <ArrowDown className="h-3 w-3" /> :
                                        <Minus className="h-3 w-3" />}
                                {Math.abs(change.value)}%
                            </div>
                        </Badge>
                    )}
                </div>
                <div className="text-sm text-gray-600">
                    Prix moyen: {formatPrice(averagePrice)}
                </div>
            </CardContent>
        </Card>
    );
}
