import React from 'react';
import { Activity, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCategory } from '../../types/product.types';

interface LowStockAlertsProps {
    lowStockProducts: Array<{
        id: string;
        name: string;
        availableStock: number;
        minStockLevel: number;
        category: ProductCategory;
    }>;
    onViewProduct?: (productId: string) => void;
    className?: string;
    loading?: boolean;
}

export function LowStockAlerts({
    lowStockProducts,
    onViewProduct,
    className,
    loading = false
}: LowStockAlertsProps) {
    if (loading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Alertes de stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-6 w-8" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (lowStockProducts.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        Alertes de stock
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <Package className="h-12 w-12 mx-auto text-green-300 mb-2" />
                        <p className="text-sm text-gray-600">Aucun problème de stock</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Alertes de stock ({lowStockProducts.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => {
                    const isOutOfStock = product.availableStock === 0;
                    const severity = isOutOfStock ? 'destructive' : 'warning';

                    return (
                        <div key={product.id} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto text-left"
                                    onClick={() => onViewProduct?.(product.id)}
                                >
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {product.availableStock} / {product.minStockLevel}
                                    </p>
                                </Button>
                            </div>
                            <Badge variant={severity} size="sm">
                                {isOutOfStock ? 'Rupture' : 'Faible'}
                            </Badge>
                        </div>
                    );
                })}
                {lowStockProducts.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                        +{lowStockProducts.length - 5} autres produits
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
