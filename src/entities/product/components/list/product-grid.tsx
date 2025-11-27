import React from 'react';
import { ProductCard } from '../product-card';
import { Product } from '../../types/product.types';
import { LoadingState } from './loading-state';

interface ProductGridProps {
    products: Product[];
    isLoading: boolean;
    onViewProduct?: (product: Product) => void;
    onEditProduct?: (product: Product) => void;
    onDeleteProduct?: (product: Product) => void;
    viewMode?: 'grid' | 'list';
    className?: string;
}

export function ProductGrid({
    products,
    isLoading,
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
    viewMode = 'grid',
    className
}: ProductGridProps) {
    if (isLoading) {
        return <LoadingState />;
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 lg:grid-cols-2'
            } ${className}`}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onView={onViewProduct}
                    onEdit={onEditProduct}
                    onDelete={onDeleteProduct}
                />
            ))}
        </div>
    );
}
