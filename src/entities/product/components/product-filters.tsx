// ============================================================================
// PRODUCT FILTERS COMPONENT
// Comprehensive filtering with tabs, dropdowns, price ranges, and sorting
// ============================================================================

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  DollarSign,
  Package,
  Tag,
  SortAsc,
  SortDesc,
  Grid3X3,
  List
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { 
  ProductCategory, 
  ProductStatus, 
  ProductSearchFilters, 
  ProductSortOptions 
} from '../types/product.types';

// ============================================================================
// FILTER TYPES AND UTILITIES
// ============================================================================

interface FilterState extends ProductSearchFilters {
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

// Stock status options
const stockStatusOptions = [
  { value: 'all', label: 'Tous les stocks', count: 0 },
  { value: 'in_stock', label: 'En stock', count: 0 },
  { value: 'low_stock', label: 'Stock faible', count: 0 },
  { value: 'out_of_stock', label: 'Rupture de stock', count: 0 },
];

// Category options
const categoryOptions = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: ProductCategory.PHONE, label: 'Téléphones' },
  { value: ProductCategory.ACCESSORY, label: 'Accessoires' },
  { value: ProductCategory.COMPONENT, label: 'Composants' },
];

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

// Format price for display
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Get active filters count
const getActiveFiltersCount = (filters: FilterState): number => {
  let count = 0;
  if (filters.category && filters.category !== 'all') count++;
  if (filters.brand) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.stockStatus && filters.stockStatus !== 'all') count++;
  if (filters.status && filters.status !== 'all') count++;
  return count;
};

// ============================================================================
// COLLAPSIBLE FILTER SECTION
// ============================================================================

interface CollapsibleFiltersProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function CollapsibleFilters({ title, children, defaultOpen = true, className }: CollapsibleFiltersProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={className}>
      <CardHeader 
        className="pb-3 cursor-pointer select-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      {isOpen && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

// ============================================================================
// CATEGORY TABS FILTER
// ============================================================================

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

function CategoryFilter({ selectedCategory, onCategoryChange, className }: CategoryFilterProps) {
  return (
    <div className={className}>
      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="grid w-full grid-cols-4">
          {categoryOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value} className="text-xs">
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categoryOptions.map((option) => (
          <TabsContent key={option.value} value={option.value} className="mt-3">
            <div className="text-xs text-gray-600">
              {option.value === 'all' 
                ? 'Affichage de toutes les catégories'
                : `Filtrage par ${option.label.toLowerCase()}`
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// ============================================================================
// PRICE RANGE FILTER
// ============================================================================

interface PriceRangeFilterProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onMinPriceChange: (price: number | undefined) => void;
  onMaxPriceChange: (price: number | undefined) => void;
  className?: string;
}

function PriceRangeFilter({ 
  minPrice, 
  maxPrice, 
  onMinPriceChange, 
  onMaxPriceChange, 
  className 
}: PriceRangeFilterProps) {
  const handleMinPriceChange = (value: string) => {
    const price = parseFloat(value) || 0;
    onMinPriceChange(price > 0 ? price : undefined);
  };

  const handleMaxPriceChange = (value: string) => {
    const price = parseFloat(value) || 0;
    onMaxPriceChange(price > 0 ? price : undefined);
  };

  const clearPriceRange = () => {
    onMinPriceChange(undefined);
    onMaxPriceChange(undefined);
  };

  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;

  return (
    <CollapsibleFilters title="Gamme de prix" defaultOpen={false} className={className}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Prix minimum
            </label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice || ''}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Prix maximum
            </label>
            <Input
              type="number"
              placeholder="Illimité"
              value={maxPrice || ''}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
        
        {hasPriceFilter && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-600">
              {minPrice && maxPrice 
                ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                : minPrice 
                ? `À partir de ${formatPrice(minPrice)}`
                : maxPrice 
                ? `Jusqu'à ${formatPrice(maxPrice)}`
                : ''
              }
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearPriceRange}
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

// ============================================================================
// STOCK STATUS FILTER
// ============================================================================

interface StockStatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  className?: string;
}

function StockStatusFilter({ selectedStatus, onStatusChange, className }: StockStatusFilterProps) {
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

// ============================================================================
// BRAND FILTER
// ============================================================================

interface BrandFilterProps {
  selectedBrand: string;
  availableBrands: string[];
  onBrandChange: (brand: string) => void;
  className?: string;
}

function BrandFilter({ selectedBrand, availableBrands, onBrandChange, className }: BrandFilterProps) {
  const clearBrand = () => {
    onBrandChange('');
  };

  return (
    <CollapsibleFilters title="Marque" defaultOpen={false} className={className}>
      <div className="space-y-3">
        <Select value={selectedBrand} onValueChange={onBrandChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les marques" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les marques</SelectItem>
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

// ============================================================================
// SORT OPTIONS FILTER
// ============================================================================

interface SortFilterProps {
  sortOption: ProductSortOptions;
  onSortChange: (sort: ProductSortOptions) => void;
  className?: string;
}

function SortFilter({ sortOption, onSortChange, className }: SortFilterProps) {
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
      stockStatus: stockStatus === 'all' ? undefined : stockStatus as any,
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
