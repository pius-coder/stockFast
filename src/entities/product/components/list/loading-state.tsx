import React from 'react';
import { ProductCard } from '../product-card';
import { Product } from '../../types/product.types';

interface LoadingStateProps {
    count?: number;
}

export function LoadingState({ count = 8 }: LoadingStateProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }, (_, index) => (
                <ProductCard key={index} product={{} as Product} isLoading />
            ))}
        </div>
    );
}
