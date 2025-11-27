// ============================================================================
// PRODUCT QUERY KEYS FACTORY
// Centralized query key management for consistent caching
// ============================================================================

import type { ProductSearchFilters } from '../types/product.types'

export const productKeys = {
    // Base key for all product-related queries
    all: ['products'] as const,

    // List queries
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters?: ProductSearchFilters) =>
        [...productKeys.lists(), { filters }] as const,

    // Detail queries
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,

    // Search queries
    searches: () => [...productKeys.all, 'search'] as const,
    search: (query: string, filters?: ProductSearchFilters) =>
        [...productKeys.searches(), { query, filters }] as const,

    // Stats queries
    stats: () => [...productKeys.all, 'stats'] as const,
}
