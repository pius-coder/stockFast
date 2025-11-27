"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Save, ArrowLeft } from "lucide-react";

interface ProductHeaderProps {
    mode: "create" | "edit";
    productName?: string;
    isSubmitting: boolean;
    isPending: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

export function ProductHeader({
    mode,
    productName,
    isSubmitting,
    isPending,
    onCancel,
    onSubmit,
}: ProductHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting || isPending}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {mode === "create" 
                            ? "Créer un nouveau produit" 
                            : "Modifier le produit"
                        }
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {mode === "create"
                            ? "Ajoutez un nouveau produit à votre inventaire"
                            : `Modification de ${productName}`
                        }
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {isSubmitting || isPending ? (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Sauvegarde...</span>
                    </div>
                ) : (
                    <Button
                        type="submit"
                        form="product-form"
                        disabled={isSubmitting || isPending}
                        onClick={onSubmit}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {mode === "create" ? "Créer le produit" : "Mettre à jour"}
                    </Button>
                )}
            </div>
        </div>
    );
}
