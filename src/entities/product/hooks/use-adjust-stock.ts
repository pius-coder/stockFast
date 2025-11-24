// ============================================================================
// USE ADJUST STOCK HOOK
// Adjust product stock levels
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productKeys } from './product-query-keys'
import { adjustStock } from '../actions/product-actions'

interface AdjustStockParams {
    productId: string
    newStock: number
    reason: string
    notes?: string
}

export function useAdjustStock() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, newStock, reason, notes }: AdjustStockParams) =>
            adjustStock(productId, newStock, reason, notes),

        onSuccess: (result, variables) => {
            if (result.success) {
                // Invalidate product lists
                queryClient.invalidateQueries({ queryKey: productKeys.lists() })

                // Invalidate specific product detail
                queryClient.invalidateQueries({
                    queryKey: productKeys.detail(variables.productId)
                })

                toast.success(result.message || 'Stock ajusté avec succès')
            } else {
                toast.error(result.error || 'Erreur lors de l\'ajustement du stock')
            }
        },

        onError: (error) => {
            console.error('Error adjusting stock:', error)
            toast.error('Erreur interne du serveur')
        },
    })
}
