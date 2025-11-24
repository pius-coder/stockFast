'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data is considered fresh for 1 minute
                        staleTime: 60 * 1000,
                        // Don't refetch on window focus
                        refetchOnWindowFocus: false,
                        // Retry failed requests once
                        retry: 1,
                        // Keep unused data in cache for 5 minutes
                        gcTime: 5 * 60 * 1000,
                    },
                    mutations: {
                        // Retry failed mutations once
                        retry: 1,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
