import React from 'react';
import { Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCategory } from '../../types/product.types';

interface CategoryBreakdownProps {
    categories: Record<ProductCategory, number>;
    onFilterByCategory?: (category: ProductCategory) => void;
    className?: string;
    loading?: boolean;
}

export function CategoryBreakdown({
    categories,
    onFilterByCategory,
    className,
    loading = false
}: CategoryBreakdownProps) {
    const categoryLabels = {
        [ProductCategory.PHONE]: 'Téléphones',
        [ProductCategory.ACCESSORY]: 'Accessoires',
        [ProductCategory.COMPONENT]: 'Composants'
    };

    const categoryColors = {
        [ProductCategory.PHONE]: 'bg-blue-500',
        [ProductCategory.ACCESSORY]: 'bg-green-500',
        [ProductCategory.COMPONENT]: 'bg-purple-500'
    };

    const totalProducts = Object.values(categories).reduce((sum, count) => sum + count, 0);

    if (loading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Répartition par catégorie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Object.keys(categoryLabels).map((category) => (
                        <div key={category} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-8" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Répartition par catégorie
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(categories).map(([category, count]) => {
                    const percentage = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
                    const colorClass = categoryColors[category as ProductCategory];

                    return (
                        <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto font-medium text-gray-900 hover:text-primary"
                                    onClick={() => onFilterByCategory?.(category as ProductCategory)}
                                >
                                    {categoryLabels[category as ProductCategory]}
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">{count}</span>
                                    <Badge variant="outline" size="sm">
                                        {percentage.toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
