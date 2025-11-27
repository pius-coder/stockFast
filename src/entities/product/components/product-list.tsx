// ============================================================================
// PRODUCT LIST COMPONENT
// Main container with grid layout, pagination, and integration of all features
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Filter, Grid3X3, List, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ProductSearch } from './product-search';
import { ProductFilters, type FilterState } from './product-filters';
import { useProducts } from '../hooks/use-products';
import { useSearchProducts } from '../hooks/use-search-products';
import { Product, ProductSearchFilters } from '../types/product.types';

import {
  EmptyState,
  ErrorState,
  ProductGrid,
  ProductPagination
} from './list';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ProductListProps {
  onViewProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  initialFilters?: Partial<FilterState>;
  pageSize?: number;
  showStats?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  className?: string;
  enableVirtualization?: boolean;
}

// ============================================================================
// MAIN PRODUCT LIST COMPONENT
// ============================================================================

export function ProductList({
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  initialFilters = {},
  pageSize = 20,
  showFilters = true,
  showSearch = true,
  className,
}: ProductListProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: undefined,
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    stockStatus: undefined,
    status: undefined,
    sort: { field: 'name', direction: 'asc' },
    ...initialFilters
  });

  // Prepare search filters
  const searchFilters: ProductSearchFilters = useMemo(() => ({
    ...filters,
    sort: undefined, // Remove sort from search filters
  }), [filters]);

  // Query for products
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useProducts({
    ...searchFilters,
    page: currentPage,
    limit: pageSize,
    field: filters.sort.field,
    direction: filters.sort.direction
  });

  // Query for search results (when there's a search query)
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: searchError
  } = useSearchProducts(searchQuery, searchFilters);

  // Determine which data to use with proper memoization
  const isLoading = useMemo(() => 
    searchQuery.trim() ? isLoadingSearch : isLoadingProducts,
    [searchQuery, isLoadingSearch, isLoadingProducts]
  );
  
  const error = useMemo(() => 
    searchQuery.trim() ? searchError : productsError,
    [searchQuery, searchError, productsError]
  );
  
  const products = useMemo(() => 
    searchQuery.trim() ? (searchData?.data || []) : (productsData?.data || []),
    [searchQuery, searchData, productsData]
  );
  
  const apiPagination = useMemo(() => 
    searchQuery.trim() ? searchData?.pagination : productsData?.pagination,
    [searchQuery, searchData, productsData]
  );

  // Update pagination from API response
  useEffect(() => {
    if (apiPagination) {
      // Update pagination state here if needed
    }
  }, [apiPagination]);

  // Check for active filters
  const hasActiveFilters = useMemo(() => {
    return !!(filters.category || filters.brand || filters.minPrice ||
      filters.maxPrice || filters.stockStatus || filters.status || searchQuery.trim());
  }, [filters, searchQuery]);

  // Handle search
  const handleSearch = useCallback((query: string, searchFilters?: ProductSearchFilters) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search

    // Update filters if provided
    if (searchFilters) {
      setFilters((prev: FilterState) => ({ ...prev, ...searchFilters }));
    }
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      stockStatus: undefined,
      status: undefined,
      sort: { field: 'name', direction: 'asc' }
    });
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  // Get available brands for filter (in real app, this would come from API)
  const memoizedProducts = useMemo(() => products || [], [products]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    memoizedProducts.forEach(product => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).sort();
  }, [memoizedProducts]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="space-y-4">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {showSearch && (
              <div className="flex-1 max-w-md">
                <ProductSearch
                  onSearch={handleSearch}
                  filters={filters}
                  placeholder="Rechercher des produits..."
                  debounceDelay={300}
                />
              </div>
            )}
          </div>

          {/* View Mode and Filter Toggle */}
          <div className="flex items-center gap-2">
            {showFilters && (
              <Button
                variant={showFiltersPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="sm:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {hasActiveFilters && (
                  <Badge variant="secondary" size="sm" className="ml-2">
                    {/* Active filters count would go here */}
                  </Badge>
                )}
              </Button>
            )}

            <div className="hidden sm:flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
                aria-label="Vue grille"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
                aria-label="Vue liste"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {(products.length > 0 || isLoading) && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement...
                  </div>
                ) : (
                  `${products.length} produit${products.length !== 1 ? 's' : ''}`
                )}
              </span>
              {searchQuery && (
                <Badge variant="outline" className="text-xs">
                  Recherche: &quot;{searchQuery}&quot;
                </Badge>
              )}
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-xs"
              >
                Effacer tous les filtres
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className={`lg:col-span-1 ${!showFiltersPanel ? 'hidden lg:block' : ''}`}>
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableBrands={availableBrands}
              collapsible={false}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
          {error ? (
            <ErrorState
              error={error instanceof Error ? error.message : 'Une erreur est survenue'}
              onRetry={handleRetry}
            />
          ) : products.length === 0 && !isLoading ? (
            <EmptyState
              searchQuery={searchQuery}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              onSearchProducts={() => { }}
            />
          ) : (
            <>
              <ProductGrid
                products={products}
                isLoading={isLoading}
                onViewProduct={onViewProduct}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
                viewMode={viewMode}
              />

              {/* Pagination */}
              {apiPagination && apiPagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <ProductPagination
                    pagination={{
                      page: apiPagination.page,
                      limit: apiPagination.limit,
                      total: apiPagination.total,
                      totalPages: apiPagination.totalPages
                    }}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ProductList;
