"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { ProductCategory, ProductStatus } from "../../types/product.types";

interface SearchFilter {
    category?: ProductCategory;
    status?: ProductStatus;
    brand?: string;
    priceRange?: { min?: number; max?: number };
    stockStatus?: string;
}

interface ProductSearchFiltersProps {
    filters: SearchFilter;
    onFilterChange: (filters: SearchFilter) => void;
    onClearFilters: () => void;
}

const categoryLabels = {
    [ProductCategory.PHONE]: "Téléphone",
    [ProductCategory.ACCESSORY]: "Accessoire",
    [ProductCategory.COMPONENT]: "Composant",
};

const statusLabels = {
    [ProductStatus.ACTIVE]: "Actif",
    [ProductStatus.INACTIVE]: "Inactif",
    [ProductStatus.DISCONTINUED]: "Discontinué",
};

export function ProductSearchFilters({
    filters,
    onFilterChange,
    onClearFilters,
}: ProductSearchFiltersProps) {
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    if (activeFiltersCount === 0) {
        return null;
    }

    const getFilterBadges = () => {
        const badges = [];

        if (filters.category) {
            badges.push({
                key: "category",
                label: `Catégorie: ${categoryLabels[filters.category]}`,
                onRemove: () => onFilterChange({ ...filters, category: undefined }),
            });
        }

        if (filters.status) {
            badges.push({
                key: "status",
                label: `Statut: ${statusLabels[filters.status]}`,
                onRemove: () => onFilterChange({ ...filters, status: undefined }),
            });
        }

        if (filters.brand) {
            badges.push({
                key: "brand",
                label: `Marque: ${filters.brand}`,
                onRemove: () => onFilterChange({ ...filters, brand: undefined }),
            });
        }

        if (filters.stockStatus) {
            badges.push({
                key: "stockStatus",
                label: `Stock: ${filters.stockStatus}`,
                onRemove: () => onFilterChange({ ...filters, stockStatus: undefined }),
            });
        }

        return badges;
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filtres actifs:</span>
            </div>
            
            {getFilterBadges().map(({ key, label, onRemove }) => (
                <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1"
                >
                    {label}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="h-3 w-3 p-0 hover:bg-transparent"
                    >
                        <X className="h-2 w-2" />
                    </Button>
                </Badge>
            ))}
            
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
            >
                Tout effacer
            </Button>
        </div>
    );
}
