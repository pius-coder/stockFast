// ============================================================================
// PRODUCT STATS COMPONENT
// Quick statistics display with real-time updates and filter integration
// ============================================================================

import React, { useMemo } from 'react';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Tag,
  Activity,
  ShoppingCart,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product, ProductStats, ProductCategory } from '../types/product.types';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ProductStatsProps {
  products?: Product[];
  stats?: ProductStats;
  isLoading?: boolean;
  showTrends?: boolean;
  showFilters?: boolean;
  onFilterByCategory?: (category: ProductCategory) => void;
  onFilterByStockStatus?: (status: 'low_stock' | 'out_of_stock') => void;
  className?: string;
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
  loading?: boolean;
  onClick?: () => void;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
  className,
  loading = false,
  onClick
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50/50';
      case 'warning':
        return 'border-orange-200 bg-orange-50/50';
      case 'destructive':
        return 'border-red-200 bg-red-50/50';
      case 'info':
        return 'border-blue-200 bg-blue-50/50';
      default:
        return 'border-gray-200';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'destructive':
        return 'text-red-600 bg-red-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'decrease':
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      case 'neutral':
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getChangeStyles = () => {
    if (!change) return '';
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600 bg-green-100';
      case 'decrease':
        return 'text-red-600 bg-red-100';
      case 'neutral':
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card 
      className={`${getVariantStyles()} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {change && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getChangeStyles()}`}
                >
                  <div className="flex items-center gap-1">
                    {getChangeIcon()}
                    {Math.abs(change.value)}%
                  </div>
                </Badge>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full ${getIconStyles()}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CATEGORY BREAKDOWN COMPONENT
// ============================================================================

interface CategoryBreakdownProps {
  categories: Record<ProductCategory, number>;
  onFilterByCategory?: (category: ProductCategory) => void;
  className?: string;
  loading?: boolean;
}

function CategoryBreakdown({ 
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

// ============================================================================
// INVENTORY VALUE COMPONENT
// ============================================================================

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

function InventoryValue({ 
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
          <CardTitle className="text-sm font-medium">Valeur d'inventaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Valeur d'inventaire
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

// ============================================================================
// LOW STOCK ALERTS COMPONENT
// ============================================================================

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

function LowStockAlerts({ 
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
    const totalValue = products.reduce((sum, p) => sum + (p.sellingPrice * p.availableStock), 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    
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

  // Format price helper
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
          onClick={showFilters ? () => {} : undefined}
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
