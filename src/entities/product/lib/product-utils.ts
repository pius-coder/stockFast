import { AlertTriangle, CheckCircle } from 'lucide-react';

export const calculateProfitMargin = (purchasePrice: number, sellingPrice: number): number => {
    if (purchasePrice === 0) return 0;
    return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
};

export const getStockStatusInfo = (availableStock: number, minStockLevel: number) => {
    if (availableStock === 0) {
        return {
            status: 'out_of_stock' as const,
            label: 'Rupture de stock',
            icon: AlertTriangle,
            variant: 'destructive' as const,
            color: 'text-red-600'
        };
    } else if (availableStock <= minStockLevel) {
        return {
            status: 'low_stock' as const,
            label: 'Stock faible',
            icon: AlertTriangle,
            variant: 'warning' as const,
            color: 'text-orange-600'
        };
    } else {
        return {
            status: 'in_stock' as const,
            label: 'En stock',
            icon: CheckCircle,
            variant: 'success' as const,
            color: 'text-green-600'
        };
    }
};

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const getCategoryLabel = (category: string): string => {
    const categoryMap = {
        'PHONE': 'Téléphone',
        'ACCESSORY': 'Accessoire',
        'COMPONENT': 'Composant'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
};
