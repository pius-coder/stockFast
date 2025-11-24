// ============================================================================
// USE SEARCH PRODUCTS HOOK
// Advanced search with debouncing and filters
// ============================================================================

import { useQuery } from '@tanstack/react-query'
import { productKeys } from './product-query-keys'
import type { ProductSearchFilters, ProductListApiResponse } from '../types/product.types'

async function searchProducts(
    query: string,
    filters?: ProductSearchFilters
): Promise<ProductListApiResponse> {
    const params = new URLSearchParams()

    params.append('query', query)

    if (filters) {
        if (filters.category) params.append('category', filters.category)
        if (filters.brand) params.append('brand', filters.brand)
        if (filters.priceMin) params.append('priceMin', filters.priceMin.toString())
        if (filters.priceMax) params.append('priceMax', filters.priceMax.toString())
        if (filters.stockStatus) params.append('stockStatus', filters.stockStatus)
        if (filters.exactMatch) params.append('exactMatch', 'true')
        if (filters.includeInactive) params.append('includeInactive', 'true')
    }

    const response = await fetch(`/api/products/search?${params.toString()}`)

    if (!response.ok) {
        throw new Error('Failed to search products')
    }

    return response.json()
}

export function useSearchProducts(query: string, filters?: ProductSearchFilters) {
    return useQuery({
        queryKey: productKeys.search(query, filters),
        queryFn: () => searchProducts(query, filters),
        // Only search if query is at least 2 characters
        enabled: query.length >= 2,
        // Keep previous data while fetching
        placeholderData: (previousData) => previousData,
    })
}
