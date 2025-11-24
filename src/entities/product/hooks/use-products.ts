// ============================================================================
// USE PRODUCTS HOOK
// Fetch paginated and filtered list of products
// ============================================================================

import { useQuery } from '@tanstack/react-query'
import { productKeys } from './product-query-keys'
import type { ProductSearchFilters, ProductListApiResponse } from '../types/product.types'

async function fetchProducts(filters?: ProductSearchFilters): Promise<ProductListApiResponse> {
    const params = new URLSearchParams()

    if (filters) {
        if (filters.query) params.append('search', filters.query)
        if (filters.category) params.append('category', filters.category)
        if (filters.status) params.append('status', filters.status)
        if (filters.brand) params.append('brand', filters.brand)
        if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
        if (filters.stockStatus) params.append('stockStatus', filters.stockStatus)
        if (filters.lowStock) params.append('lowStock', 'true')
        if (filters.outOfStock) params.append('outOfStock', 'true')
    }

    const response = await fetch(`/api/products?${params.toString()}`)

    if (!response.ok) {
        throw new Error('Failed to fetch products')
    }

    return response.json()
}

export function useProducts(filters?: ProductSearchFilters) {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => fetchProducts(filters),
        // Keep previous data while fetching new data
        placeholderData: (previousData) => previousData,
    })
}
