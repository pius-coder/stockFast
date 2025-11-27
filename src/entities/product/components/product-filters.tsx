// ============================================================================
// PRODUCT FILTERS COMPONENT
// Comprehensive filtering with tabs, dropdowns, price ranges, and sorting
// ============================================================================

import React, { useState, useCallback, useMemo } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ProductCategory,
  ProductSearchFilters,
  ProductSortOptions
} from '../types/product.types';

import {
  CategoryFilter,
  BrandFilter,
  PriceRangeFilter,
  StockStatusFilter,
  SortFilter
} from './filters';

// ============================================================================
// FILTER TYPES AND UTILITIES
// ============================================================================

export interface FilterState extends ProductSearchFilters {
  sort: ProductSortOptions;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableBrands?: string[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Get active filters count
const getActiveFiltersCount = (filters: FilterState): number => {
  let count = 0;
  if (filters.category && (filters.category as string) !== 'all') count++;
  if (filters.brand) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.stockStatus && (filters.stockStatus as string) !== 'all') count++;
  if (filters.status && (filters.status as string) !== 'all') count++;
  return count;
};

// ============================================================================
// MAIN PRODUCT FILTERS COMPONENT
// ============================================================================

export function ProductFilters({
  filters,
  onFiltersChange,
  availableBrands = [],
  className,
  collapsible = true,
  defaultCollapsed = false
}: ProductFiltersProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => getActiveFiltersCount(filters), [filters]);

  // Handle filter changes
  const handleCategoryChange = useCallback((category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'all' ? undefined : category as ProductCategory,
    });
  }, [filters, onFiltersChange]);

  const handleBrandChange = useCallback((brand: string) => {
    onFiltersChange({
      ...filters,
      brand: brand || undefined,
    });
  }, [filters, onFiltersChange]);

  const handleMinPriceChange = useCallback((minPrice: number | undefined) => {
    onFiltersChange({
      ...filters,
      minPrice,
    });
  }, [filters, onFiltersChange]);

  const handleMaxPriceChange = useCallback((maxPrice: number | undefined) => {
    onFiltersChange({
      ...filters,
      maxPrice,
    });
  }, [filters, onFiltersChange]);

  const handleStockStatusChange = useCallback((stockStatus: string) => {
    onFiltersChange({
      ...filters,
      stockStatus: stockStatus === 'all' ? undefined : stockStatus as 'in_stock' | 'low_stock' | 'out_of_stock',
    });
  }, [filters, onFiltersChange]);

  const handleSortChange = useCallback((sort: ProductSortOptions) => {
    onFiltersChange({
      ...filters,
      sort,
    });
  }, [filters, onFiltersChange]);

  const handleResetFilters = useCallback(() => {
    onFiltersChange({
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      stockStatus: undefined,
      status: undefined,
      sort: { field: 'name', direction: 'asc' },
    });
  }, [onFiltersChange]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  if (!collapsible) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Filtres</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-7 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Filters Content */}
        <div className="space-y-4">
          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={filters.category || 'all'}
            onCategoryChange={handleCategoryChange}
          />

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <BrandFilter
              selectedBrand={filters.brand || ''}
              availableBrands={availableBrands}
              onBrandChange={handleBrandChange}
            />
          )}

          {/* Price Range Filter */}
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
          />

          {/* Stock Status Filter */}
          <StockStatusFilter
            selectedStatus={filters.stockStatus || 'all'}
            onStatusChange={handleStockStatusChange}
          />

          {/* Sort Filter */}
          <SortFilter
            sortOption={filters.sort}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle
          className="text-lg font-semibold flex items-center justify-between cursor-pointer select-none"
          onClick={toggleCollapsed}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetFilters();
                }}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            )}
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </div>
        </CardTitle>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={filters.category || 'all'}
            onCategoryChange={handleCategoryChange}
          />

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <BrandFilter
              selectedBrand={filters.brand || ''}
              availableBrands={availableBrands}
              onBrandChange={handleBrandChange}
            />
          )}

          {/* Price Range Filter */}
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
          />

          {/* Stock Status Filter */}
          <StockStatusFilter
            selectedStatus={filters.stockStatus || 'all'}
            onStatusChange={handleStockStatusChange}
          />

          {/* Sort Filter */}
          <SortFilter
            sortOption={filters.sort}
            onSortChange={handleSortChange}
          />
        </CardContent>
      )}
    </Card>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ProductFilters;
