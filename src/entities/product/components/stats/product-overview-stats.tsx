"use client";

import { Package, AlertTriangle, DollarSign } from "lucide-react";
import { StatCard } from "./stat-card";
import type { ProductStats } from "../../types/product.types";

interface ProductOverviewStatsProps {
    stats?: ProductStats;
    isLoading?: boolean;
}

export function ProductOverviewStats({ stats, isLoading }: ProductOverviewStatsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucune statistique disponible
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total des produits"
                value={stats.totalProducts.toLocaleString()}
                icon={Package}
                variant="default"
            />

            <StatCard
                title="Produits actifs"
                value={stats.activeProducts.toLocaleString()}
                icon={Package}
                variant="success"
            />

            <StatCard
                title="Stock faible"
                value={stats.lowStockProducts.toLocaleString()}
                icon={AlertTriangle}
                variant={stats.lowStockProducts > 0 ? "warning" : "default"}
            />

            <StatCard
                title="Valeur totale"
                value={`${stats.totalValue.toLocaleString()} FCFA`}
                icon={DollarSign}
                variant="default"
            />
        </div>
    );
}
