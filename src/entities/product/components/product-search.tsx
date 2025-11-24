// ============================================================================
// PRODUCT SEARCH COMPONENT
// Advanced search input with debouncing, suggestions, and integration
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearchProducts } from '../hooks/use-search-products';
import type { ProductSearchFilters, Product } from '../types/product.types';

// ============================================================================
// SEARCH HOOK WITH DEBOUNCING
// ============================================================================

interface UseDebouncedSearchProps {
  query: string;
  delay?: number;
  filters?: ProductSearchFilters;
}

function useDebouncedSearch({ query, delay = 300, filters }: UseDebouncedSearchProps) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return useSearchProducts(debouncedQuery, filters);
}

// ============================================================================
// SEARCH SUGGESTIONS COMPONENT
// ============================================================================

interface SearchSuggestionsProps {
  suggestions: Product[];
  isLoading: boolean;
  onSelectSuggestion: (product: Product) => void;
  query: string;
  className?: string;
}

function SearchSuggestions({
  suggestions,
  isLoading,
  onSelectSuggestion,
  query,
  className
}: SearchSuggestionsProps) {
  // Don't show suggestions if loading or no query
  if (isLoading || !query.trim()) {
    return null;
  }

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto ${className}`}>
      {suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Aucun résultat trouvé pour "{query}"</p>
          <p className="text-xs text-gray-400 mt-1">
            Essayez avec d'autres mots-clés ou vérifiez l'orthographe
          </p>
        </div>
      ) : (
        <>
          {/* Search Results Header */}
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Résultats de recherche
              </span>
              <Badge variant="secondary" size="sm">
                {suggestions.length} résultat{suggestions.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="py-1">
            {suggestions.map((product) => (
              <button
                key={product.id}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-50 last:border-b-0"
                onClick={() => onSelectSuggestion(product)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {highlightMatch(product.name, query)}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {product.brand} • {product.model}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      IMEI: {product.imei}
                    </p>
                  </div>
                  <div className="ml-3 text-right flex-shrink-0">
                    <Badge 
                      variant={product.availableStock > product.minStockLevel ? 'success' : product.availableStock > 0 ? 'warning' : 'destructive'}
                      size="sm"
                    >
                      {product.availableStock > product.minStockLevel 
                        ? 'En stock' 
                        : product.availableStock > 0 
                        ? 'Stock faible' 
                        : 'Rupture'
                      }
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PRODUCT SEARCH COMPONENT
// ============================================================================

interface ProductSearchProps {
  onSearch: (query: string, filters?: ProductSearchFilters) => void;
  onSelectProduct?: (product: Product) => void;
  filters?: ProductSearchFilters;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function ProductSearch({
  onSearch,
  onSelectProduct,
  filters,
  placeholder = "Rechercher des produits...",
  className,
  debounceDelay = 300,
  showSuggestions = true,
  autoFocus = false,
  disabled = false
}: ProductSearchProps) {
  // Local state
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search hook
  const { data: searchResults, isLoading: isSearching } = useDebouncedSearch({
    query,
    delay: debounceDelay,
    filters
  });

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Show suggestions dropdown when typing
    if (showSuggestions && value.trim().length >= 2) {
      setShowSuggestionsDropdown(true);
    } else {
      setShowSuggestionsDropdown(false);
    }

    // Debounced search execution
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        onSearch(value.trim(), filters);
      }
    }, debounceDelay);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && query.trim().length >= 2) {
      setShowSuggestionsDropdown(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestionsDropdown(false);
    }, 150);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setShowSuggestionsDropdown(false);
    onSearch('', filters);
    inputRef.current?.focus();
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (product: Product) => {
    setQuery(product.name);
    setShowSuggestionsDropdown(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setShowSuggestionsDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Recent searches (placeholder for future implementation)
  const recentSearches: string[] = [];

  return (
    <div className={`relative ${className}`}>
      {/* Search Input Container */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className="pl-10 pr-10"
          aria-label="Rechercher des produits"
          aria-describedby="search-description"
        />

        {/* Clear Button */}
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={handleClear}
              disabled={disabled}
              aria-label="Effacer la recherche"
            >
              <X className="h-3 w-3 text-gray-400" />
            </Button>
          </div>
        )}
      </div>

      {/* Search Status Indicator */}
      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Recherche en cours...
          </div>
        </div>
      )}

      {/* Search Suggestions Dropdown */}
      {showSuggestions && showSuggestionsDropdown && (
        <SearchSuggestions
          suggestions={searchResults?.data || []}
          isLoading={isSearching}
          onSelectSuggestion={handleSelectSuggestion}
          query={query}
          className="mt-1"
        />
      )}

      {/* Recent Searches (placeholder) */}
      {!query && isFocused && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Recherches récentes</span>
          </div>
          <div className="py-1">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-600"
                onClick={() => handleInputChange(search)}
              >
                <Search className="h-3 w-3 inline mr-2" />
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Screen Reader Description */}
      <div id="search-description" className="sr-only">
        Tapez au moins 2 caractères pour rechercher des produits. 
        Utilisez les touches fléchées pour naviguer dans les suggestions et Entrée pour sélectionner.
      </div>
    </div>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ProductSearch;
