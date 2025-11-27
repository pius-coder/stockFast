// ============================================================================
// USE PRODUCTS HOOK
// Fetch paginated and filtered list of products
// ============================================================================

import { useQuery } from '@tanstack/react-query'
import { productKeys } from './product-query-keys'
import type { ProductSearchParams, ProductListApiResponse } from '../types/product.types'

async function fetchProducts(params?: ProductSearchParams): Promise<ProductListApiResponse> {
    const searchParams = new URLSearchParams()

    if (params) {
        if (params.query) searchParams.append('search', params.query)
        if (params.category) searchParams.append('category', params.category)
        if (params.status) searchParams.append('status', params.status)
        if (params.brand) searchParams.append('brand', params.brand)
        if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString())
        if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString())
        if (params.stockStatus) searchParams.append('stockStatus', params.stockStatus)
        if (params.lowStock) searchParams.append('lowStock', 'true')
        if (params.outOfStock) searchParams.append('outOfStock', 'true')
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.limit) searchParams.append('limit', params.limit.toString())
    }

    const response = await fetch(`/api/products?${searchParams.toString()}`)

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('UNAUTHORIZED')
        }
        throw new Error('Failed to fetch products')
    }

    return response.json()
}

export function useProducts(params?: ProductSearchParams) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => fetchProducts(params),
        // Keep previous data while fetching new data
        placeholderData: (previousData) => previousData,
        // Don't retry on auth errors
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message === 'UNAUTHORIZED') {
                return false
            }
            return failureCount < 3
        },
        // Reduce stale time to avoid excessive requests
        staleTime: 30000, // 30 seconds
    })
}
