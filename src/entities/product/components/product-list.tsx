// ============================================================================
// PRODUCT LIST COMPONENT
// Main container with grid layout, pagination, and integration of all features
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  RefreshCw,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

import { ProductCard } from './product-card';
import { ProductSearch } from './product-search';
import { ProductFilters, type FilterState } from './product-filters';
import { useProducts } from '../hooks/use-products';
import { useSearchProducts } from '../hooks/use-search-products';
import type { Product, ProductSearchFilters, ProductSortOptions } from '../types/product.types';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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
// EMPTY STATE COMPONENT
// ============================================================================

interface EmptyStateProps {
  searchQuery?: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onSearchProducts: () => void;
}

function EmptyState({ searchQuery, hasActiveFilters, onClearFilters, onSearchProducts }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        {searchQuery ? (
          <>
            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Aucun résultat pour "<span className="font-medium">{searchQuery}</span>"
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Suggestions :
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>Vérifiez l'orthographe des mots-clés</li>
                <li>Essayez des mots-clés plus généraux</li>
                <li>Essayez moins de mots-clés</li>
                {hasActiveFilters && (
                  <li>
                    <Button variant="link" size="sm" onClick={onClearFilters} className="p-0 h-auto text-primary">
                      Effacez les filtres actifs
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </>
        ) : hasActiveFilters ? (
          <>
            <Filter className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun produit ne correspond à vos critères
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos filtres ou de les réinitialiser
            </p>
            <Button onClick={onClearFilters} variant="outline">
              Réinitialiser les filtres
            </Button>
          </>
        ) : (
          <>
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun produit disponible
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par ajouter votre premier produit
            </p>
            <Button onClick={onSearchProducts}>
              Ajouter un produit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LOADING STATE COMPONENT
// ============================================================================

interface LoadingStateProps {
  count?: number;
}

function LoadingState({ count = 8 }: LoadingStateProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <ProductCard key={index} product={{} as Product} isLoading />
      ))}
    </div>
  );
}

// ============================================================================
// ERROR STATE COMPONENT
// ============================================================================

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <AlertCircle className="h-16 w-16 text-red-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        {error}
      </p>
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
    </div>
  );
}

// ============================================================================
// GRID VIEW COMPONENT
// ============================================================================

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onViewProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

function ProductGrid({ 
  products, 
  isLoading, 
  onViewProduct, 
  onEditProduct, 
  onDeleteProduct,
  viewMode = 'grid',
  className 
}: ProductGridProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1 lg:grid-cols-2'
    } ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={onViewProduct}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
}

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================

interface ProductPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

function ProductPagination({ pagination, onPageChange, className }: ProductPaginationProps) {
  const { page, totalPages } = pagination;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (page <= 3) {
        // Near the beginning
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        // Near the end
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            aria-label="Page précédente"
            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Précédent</span>
          </PaginationPrevious>
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(pageNum as number)}
                isActive={page === pageNum}
                aria-label={`Aller à la page ${pageNum}`}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            aria-label="Page suivante"
            className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
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
  showStats = false,
  showFilters = true,
  showSearch = true,
  className,
  enableVirtualization = false
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

  // Calculate pagination
  const pagination: PaginationInfo = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    total: 0, // Will be updated from API response
    totalPages: 0 // Will be updated from API response
  }), [currentPage, pageSize]);

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
    limit: pageSize
  });

  // Query for search results (when there's a search query)
  const { 
    data: searchData, 
    isLoading: isLoadingSearch,
    error: searchError
  } = useSearchProducts(searchQuery, searchFilters);

  // Determine which data to use
  const isLoading = searchQuery.trim() ? isLoadingSearch : isLoadingProducts;
  const error = searchQuery.trim() ? searchError : productsError;
  const products = searchQuery.trim() ? (searchData?.data || []) : (productsData?.data || []);
  const apiPagination = searchQuery.trim() ? searchData?.pagination : productsData?.pagination;

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
      setFilters(prev => ({ ...prev, ...searchFilters }));
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
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(product => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).sort();
  }, [products]);

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
                  Recherche: "{searchQuery}"
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
              onSearchProducts={() => {}}
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
