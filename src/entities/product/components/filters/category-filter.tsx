import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductCategory } from '../../types/product.types';

// Category options
const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: ProductCategory.PHONE, label: 'Téléphones' },
    { value: ProductCategory.ACCESSORY, label: 'Accessoires' },
    { value: ProductCategory.COMPONENT, label: 'Composants' },
];

interface CategoryFilterProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    className?: string;
}

export function CategoryFilter({ selectedCategory, onCategoryChange, className }: CategoryFilterProps) {
    return (
        <div className={className}>
            <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
                <TabsList className="grid w-full grid-cols-4">
                    {categoryOptions.map((option) => (
                        <TabsTrigger key={option.value} value={option.value} className="text-xs">
                            {option.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {categoryOptions.map((option) => (
                    <TabsContent key={option.value} value={option.value} className="mt-3">
                        <div className="text-xs text-gray-600">
                            {option.value === 'all'
                                ? 'Affichage de toutes les catégories'
                                : `Filtrage par ${option.label.toLowerCase()}`
                            }
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
