import React from 'react';
import { Search, Filter, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    searchQuery?: string;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onSearchProducts: () => void;
}

export function EmptyState({ searchQuery, hasActiveFilters, onClearFilters, onSearchProducts }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
                {searchQuery ? (
                    <>
                        <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun produit trouvé
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Aucun résultat pour &quot;<span className="font-medium">{searchQuery}</span>&quot;
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">
                                Suggestions :
                            </p>
                            <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                                <li>Vérifiez l&apos;orthographe des mots-clés</li>
                                <li>Essayez des mots-clés plus généraux</li>
                                <li>Essayez moins de mots-clés</li>
                                {hasActiveFilters && (
                                    <li>
                                        <Button variant="link" size="sm" onClick={onClearFilters} className="p-0 h-auto text-primary">
                                            Effacez les filtres actifs
                                        </Button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </>
                ) : hasActiveFilters ? (
                    <>
                        <Filter className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun produit ne correspond à vos critères
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Essayez de modifier vos filtres ou de les réinitialiser
                        </p>
                        <Button onClick={onClearFilters} variant="outline">
                            Réinitialiser les filtres
                        </Button>
                    </>
                ) : (
                    <>
                        <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun produit disponible
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Commencez par ajouter votre premier produit
                        </p>
                        <Button onClick={onSearchProducts}>
                            Ajouter un produit
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
