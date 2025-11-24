// ============================================================================
// USE CREATE PRODUCT HOOK
// Create new product with optimistic updates
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { productKeys } from './product-query-keys'
import { createProduct } from '../actions/product-actions'

export function useCreateProduct() {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: createProduct,

        onSuccess: (result: Awaited<ReturnType<typeof createProduct>>) => {
            if (result.success) {
                // Invalidate and refetch product lists
                queryClient.invalidateQueries({ queryKey: productKeys.lists() })

                // Show success message
                toast.success(result.message || 'Produit créé avec succès')

                // Redirect to product detail page
                if (result.data?.id) {
                    router.push(`/products/${result.data.id}`)
                } else {
                    router.push('/products')
                }
            } else {
                // Show error message
                toast.error(result.error || 'Erreur lors de la création du produit')
            }
        },

        onError: (error: Error) => {
            console.error('Error creating product:', error)
            toast.error('Erreur interne du serveur')
        },
    })
}
