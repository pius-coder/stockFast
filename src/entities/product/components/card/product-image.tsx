import React from 'react';
import Image from 'next/image';
import { Package, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types/product.types';

interface ProductImageProps {
    product: Product;
}

export function ProductImage({ product }: ProductImageProps) {
    return (
        <div className="relative">
            {product.images && product.images.length > 0 ? (
                <>
                    <Image
                        src={product.images[0]}
                        alt={`${product.name} - ${product.brand}`}
                        width={128}
                        height={128}
                        className="w-full h-32 object-cover rounded-md bg-gray-100"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center hidden">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                </>
            ) : (
                <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
            )}

            {/* Stock Count Overlay */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Package className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">
                    {product.availableStock}
                </span>
            </div>
        </div>
    );
}
