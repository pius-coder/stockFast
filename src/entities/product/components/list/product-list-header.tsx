"use client";

import { Button } from "@/components/ui/button";
import { Filter, Grid3X3, List, RefreshCw } from "lucide-react";

interface ProductListHeaderProps {
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    onRefresh: () => void;
    onToggleFilters: () => void;
    isLoading: boolean;
}

export function ProductListHeader({
    viewMode,
    onViewModeChange,
    onRefresh,
    onToggleFilters,
    isLoading,
}: ProductListHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-semibold">Produits</h2>
                {isLoading && (
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
            </div>
            
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleFilters}
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                </Button>
                
                <div className="flex border rounded-md">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("grid")}
                        className="rounded-r-none"
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("list")}
                        className="rounded-l-none border-l"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>
        </div>
    );
}
