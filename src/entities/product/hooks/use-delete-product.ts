// ============================================================================
// USE DELETE PRODUCT HOOK
// Soft delete product (set status to INACTIVE)
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { productKeys } from './product-query-keys'
import { deleteProduct } from '../actions/product-actions'

export function useDeleteProduct() {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: deleteProduct,

        onSuccess: (result, productId) => {
            if (result.success) {
                // Invalidate product lists
                queryClient.invalidateQueries({ queryKey: productKeys.lists() })

                // Remove product detail from cache
                queryClient.removeQueries({ queryKey: productKeys.detail(productId) })

                toast.success(result.message || 'Produit supprimé avec succès')

                // Redirect to products list
                router.push('/products')
            } else {
                toast.error(result.error || 'Erreur lors de la suppression du produit')
            }
        },

        onError: (error) => {
            console.error('Error deleting product:', error)
            toast.error('Erreur interne du serveur')
        },
    })
}
