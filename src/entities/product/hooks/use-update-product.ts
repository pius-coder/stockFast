// ============================================================================
// USE UPDATE PRODUCT HOOK
// Update existing product with optimistic updates
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productKeys } from './product-query-keys'
import { updateProduct } from '../actions/product-actions'

export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateProduct,

        onMutate: async (formData) => {
            const productId = formData.get('id') as string

            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: productKeys.detail(productId) })

            // Snapshot previous value
            const previousProduct = queryClient.getQueryData(productKeys.detail(productId))

            // Return context with snapshot
            return { previousProduct, productId }
        },

        onSuccess: (result, _, context) => {
            if (result.success) {
                // Invalidate product lists
                queryClient.invalidateQueries({ queryKey: productKeys.lists() })

                // Invalidate specific product detail
                if (context?.productId) {
                    queryClient.invalidateQueries({
                        queryKey: productKeys.detail(context.productId)
                    })
                }

                toast.success(result.message || 'Produit mis à jour avec succès')
            } else {
                toast.error(result.error || 'Erreur lors de la mise à jour du produit')
            }
        },

        onError: (error, _, context) => {
            // Rollback to previous value on error
            if (context?.previousProduct && context?.productId) {
                queryClient.setQueryData(
                    productKeys.detail(context.productId),
                    context.previousProduct
                )
            }

            console.error('Error updating product:', error)
            toast.error('Erreur interne du serveur')
        },
    })
}
