// ============================================================================
// PRODUCT STATS COMPONENT
// Quick statistics display with real-time updates and filter integration
// ============================================================================

import React, { useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';

import { ProductCategory } from '../types/product.types';
import type { Product, ProductStats as ProductStatsType } from '../types/product.types';
import { formatPrice } from '../lib/product-utils';
import {
  StatCard,
  CategoryBreakdown,
  InventoryValue,
  LowStockAlerts
} from './stats';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ProductStatsProps {
  products?: Product[];
  stats?: ProductStatsType;
  isLoading?: boolean;
  showTrends?: boolean;
  showFilters?: boolean;
  onFilterByCategory?: (category: ProductCategory) => void;
  onFilterByStockStatus?: (status: 'low_stock' | 'out_of_stock') => void;
  className?: string;
}

// ============================================================================
// MAIN PRODUCT STATS COMPONENT
// ============================================================================

export function ProductStats({
  products = [],
  stats,
  isLoading = false,
  showTrends = true,
  showFilters = true,
  onFilterByCategory,
  onFilterByStockStatus,
  className
}: ProductStatsProps) {
  // Calculate stats from products if not provided
  const calculatedStats = useMemo(() => {
    if (stats) return stats;

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.availableStock <= p.minStockLevel && p.availableStock > 0);
    const outOfStockProducts = products.filter(p => p.availableStock === 0);
    const totalValue = products.reduce((sum, p) => sum + p.sellingPrice, 0);
    // const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0; // Calculated when needed

    const categoryBreakdown = {
      [ProductCategory.PHONE]: products.filter(p => p.category === ProductCategory.PHONE).length,
      [ProductCategory.ACCESSORY]: products.filter(p => p.category === ProductCategory.ACCESSORY).length,
      [ProductCategory.COMPONENT]: products.filter(p => p.category === ProductCategory.COMPONENT).length,
    };

    return {
      totalProducts,
      activeProducts: products.filter(p => p.status === 'ACTIVE').length,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      totalValue,
      categoryBreakdown,
    };
  }, [products, stats]);

  // Get low stock products for alerts
  const lowStockAlerts = useMemo(() => {
    return products
      .filter(p => p.availableStock <= p.minStockLevel && p.availableStock > 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        availableStock: p.availableStock,
        minStockLevel: p.minStockLevel,
        category: p.category
      }))
      .sort((a, b) => a.availableStock - b.availableStock); // Sort by stock level ascending
  }, [products]);

  // Mock trend data (in real app, this would come from historical data)
  const trendData = {
    totalProducts: { value: 12, type: 'increase' as const },
    totalValue: { value: 8, type: 'increase' as const },
    lowStockProducts: { value: 5, type: 'decrease' as const },
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Produits"
          value={calculatedStats.totalProducts}
          change={showTrends ? trendData.totalProducts : undefined}
          icon={Package}
          variant="default"
          loading={isLoading}
          onClick={showFilters ? () => { } : undefined}
        />

        <StatCard
          title="Valeur Inventaire"
          value={formatPrice(calculatedStats.totalValue)}
          change={showTrends ? trendData.totalValue : undefined}
          icon={DollarSign}
          variant="success"
          loading={isLoading}
        />

        <StatCard
          title="Stock Faible"
          value={calculatedStats.lowStockProducts}
          change={showTrends ? trendData.lowStockProducts : undefined}
          icon={AlertTriangle}
          variant="warning"
          loading={isLoading}
          onClick={showFilters && onFilterByStockStatus ? () => onFilterByStockStatus('low_stock') : undefined}
        />

        <StatCard
          title="Rupture Stock"
          value={calculatedStats.outOfStockProducts}
          icon={Package}
          variant="destructive"
          loading={isLoading}
          onClick={showFilters && onFilterByStockStatus ? () => onFilterByStockStatus('out_of_stock') : undefined}
        />
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <CategoryBreakdown
          categories={calculatedStats.categoryBreakdown}
          onFilterByCategory={onFilterByCategory}
          loading={isLoading}
        />

        {/* Inventory Value */}
        <InventoryValue
          totalValue={calculatedStats.totalValue}
          averagePrice={calculatedStats.totalProducts > 0 ? calculatedStats.totalValue / calculatedStats.totalProducts : 0}
          change={showTrends ? trendData.totalValue : undefined}
          loading={isLoading}
        />

        {/* Low Stock Alerts */}
        <LowStockAlerts
          lowStockProducts={lowStockAlerts}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ProductStats;
