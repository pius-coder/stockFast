// ============================================================================
// USE PRODUCT HOOK
// Fetch single product by ID with relations
// ============================================================================

import { useQuery } from '@tanstack/react-query'
import { productKeys } from './product-query-keys'
import type { ProductApiResponse } from '../types/product.types'

async function fetchProduct(id: string): Promise<ProductApiResponse> {
    const response = await fetch(`/api/products/${id}`)

    if (!response.ok) {
        throw new Error('Failed to fetch product')
    }

    return response.json()
}

export function useProduct(id: string | undefined) {
    return useQuery({
        queryKey: productKeys.detail(id!),
        queryFn: () => fetchProduct(id!),
        enabled: !!id, // Only run query if ID is provided
    })
}
