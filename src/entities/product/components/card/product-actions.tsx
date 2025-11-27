import React, { useState } from 'react';
import { Eye, Edit, Trash2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '../../types/product.types';
import { QRCodeDisplay } from '../qr-code-display';

interface ProductActionsProps {
    product: Product;
    onView?: (product: Product) => void;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
}

export function ProductActions({ product, onView, onEdit, onDelete }: ProductActionsProps) {
    const [showQRCode, setShowQRCode] = useState(false);

    // Handle action button clicks (prevent event bubbling)
    const handleActionClick = (action: (product: Product) => void, event: React.MouseEvent) => {
        event.stopPropagation();
        action(product);
    };

    return (
        <>
            {/* View Button */}
            <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={(e) => handleActionClick(onView || (() => { }), e)}
                disabled={!onView}
                aria-label={`Voir les détails de ${product.name}`}
            >
                <Eye className="h-4 w-4 mr-1" />
                Voir
            </Button>

            {/* Edit Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleActionClick(onEdit || (() => { }), e)}
                disabled={!onEdit}
                aria-label={`Modifier ${product.name}`}
            >
                <Edit className="h-4 w-4" />
            </Button>

            {/* QR Code Button */}
            <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowQRCode(true);
                        }}
                        aria-label="Afficher le code QR"
                    >
                        <QrCode className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
                    <DialogTitle className="sr-only">Code QR - {product.name}</DialogTitle>
                    <QRCodeDisplay product={product} qrCode={product.qrCode} />
                </DialogContent>
            </Dialog>

            {/* Delete Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleActionClick(onDelete || (() => { }), e)}
                disabled={!onDelete}
                className="text-destructive hover:text-destructive"
                aria-label={`Supprimer ${product.name}`}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </>
    );
}
