// ============================================================================
// QR CODE DISPLAY COMPONENT
// Display QR codes for products with download, print, and error handling
// ============================================================================

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Download, Printer, QrCode, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Product } from '../types/product.types';

interface QRCodeDisplayProps {
    product: Product;
    qrCode?: {
        id: string;
        code: string;
        imageData?: string;
        imageUrl?: string;
        generatedAt: Date;
    };
    className?: string;
    size?: 'small' | 'medium' | 'large';
    showDetails?: boolean;
    onError?: (error: string) => void;
}

export function QRCodeDisplay({
    product,
    qrCode,
    className = '',
    size = 'medium',
    showDetails = true,
    onError
}: QRCodeDisplayProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Size configurations
    const sizeConfig = {
        small: { width: 128, height: 128, iconSize: 16 },
        medium: { width: 256, height: 256, iconSize: 20 },
        large: { width: 384, height: 384, iconSize: 24 }
    };

    const { width, height, iconSize } = sizeConfig[size];

    // Handle QR code regeneration
    const handleRegenerateQRCode = async () => {
        if (!qrCode) return;
        
        try {
            setIsRegenerating(true);
            console.log('Starting QR code regeneration for:', qrCode.id);
            
            const response = await fetch('/api/products/regenerate-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    qrCodeId: qrCode.id
                })
            });

            console.log('QR regeneration response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('QR regeneration result:', result);
                if (result.success) {
                    // Refresh the page to show the new QR code
                    window.location.reload();
                } else {
                    console.error('QR regeneration failed:', result.error);
                    onError?.(result.error || 'Échec de la régénération du code QR');
                }
            } else {
                console.error('QR regeneration HTTP error:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                onError?.(`Erreur HTTP ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Error regenerating QR code:', error);
            onError?.('Erreur lors de la régénération du code QR');
        } finally {
            setIsRegenerating(false);
        }
    };

    // Handle download functionality
    const handleDownload = async () => {
        if (!qrCode?.imageData) {
            const error = 'Code QR non disponible pour le téléchargement';
            onError?.(error);
            return;
        }

        try {
            setIsDownloading(true);

            // Create download link
            const link = document.createElement('a');
            link.href = qrCode.imageData;
            link.download = `qr-code-${product.name.replace(/\s+/g, '-').toLowerCase()}-${product.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading QR code:', error);
            onError?.('Erreur lors du téléchargement du code QR');
        } finally {
            setIsDownloading(false);
        }
    };

    // Handle print functionality
    const handlePrint = () => {
        if (!qrCode?.imageData) {
            const error = 'Code QR non disponible pour l\'impression';
            onError?.(error);
            return;
        }

        try {
            setIsPrinting(true);

            // Create print window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('Popup bloqué - autorisez les popups pour l\'impression');
            }

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Code QR - ${product.name}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 20px;
                            margin: 0;
                        }
                        .qr-container {
                            display: inline-block;
                            padding: 20px;
                            border: 2px solid #000;
                            border-radius: 8px;
                        }
                        .qr-image {
                            max-width: 300px;
                            height: auto;
                            display: block;
                            margin: 0 auto 20px;
                        }
                        .product-info {
                            margin-top: 20px;
                            text-align: left;
                        }
                        .product-info h2 {
                            margin: 0 0 10px 0;
                            font-size: 18px;
                        }
                        .product-info p {
                            margin: 5px 0;
                            font-size: 14px;
                        }
                        @media print {
                            body { margin: 0; }
                            .qr-container { border: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <img src="${qrCode.imageData}" alt="QR Code" class="qr-image" />
                        <div class="product-info">
                            <h2>${product.name}</h2>
                            <p><strong>Marque:</strong> ${product.brand}</p>
                            <p><strong>Modèle:</strong> ${product.model}</p>
                            <p><strong>IMEI:</strong> ${product.imei}</p>
                            <p><strong>Prix:</strong> ${product.sellingPrice.toFixed(2)} FCFA</p>
                            <p><strong>Code QR:</strong> ${qrCode.code}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Print after content loads
            printWindow.onload = () => {
                printWindow.print();
                printWindow.close();
            };

        } catch (error) {
            console.error('Error printing QR code:', error);
            onError?.('Erreur lors de l\'impression du code QR');
        } finally {
            setIsPrinting(false);
        }
    };

    // Handle image load error
    // const handleImageError = () => {
    //     setImageError(true);
    //     onError?.('Erreur de chargement du code QR');
    // };

    // If no QR code data available
    if (!qrCode) {
        return (
            <Card className={`${className}`}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <QrCode className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Code QR non disponible
                    </h3>
                    <p className="text-sm text-gray-500">
                        Aucun code QR n&apos;a été généré pour ce produit
                    </p>
                </CardContent>
            </Card>
        );
    }

    // If QR code image failed to load
    if (imageError || !qrCode.imageData) {
        return (
            <Card className={`${className}`}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Erreur de code QR
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600">
                            Le code QR pour ce produit n&apos;a pas pu être chargé
                        </p>
                        <p className="text-xs text-gray-500">
                            Code QR: {qrCode.code}
                        </p>
                        <Button
                            onClick={handleRegenerateQRCode}
                            disabled={isRegenerating}
                            variant="outline"
                            size="sm"
                        >
                            {isRegenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Régénération...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Régénérer le code QR
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`${className}`}>
            {showDetails && (
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <QrCode className="w-5 h-5" />
                        Code QR du Produit
                    </CardTitle>
                </CardHeader>
            )}
            
            <CardContent className="space-y-4">
                {/* QR Code Image */}
                <div className="flex justify-center">
                    <div 
                        className="border rounded-lg p-4 bg-white"
                        style={{ width: width + 32, height: height + 32 }}
                    >
                        <Image
                            src={qrCode.imageData}
                            alt={`QR Code for ${product.name}`}
                            width={width}
                            height={height}
                            className="border border-gray-200 rounded"
                            onError={() => setImageError(true)}
                        />
                    </div>
                </div>

                {/* Product Information */}
                {showDetails && (
                    <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">Produit:</span>
                            <span>{product.name}</span>
                            
                            <span className="font-medium">IMEI:</span>
                            <span className="font-mono text-xs">{product.imei}</span>
                            
                            <span className="font-medium">Code QR:</span>
                            <span className="font-mono text-xs">{qrCode.code}</span>
                            
                            <span className="font-medium">Généré le:</span>
                            <span>{new Date(qrCode.generatedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Download className={`w-${iconSize} h-${iconSize} mr-2`} />
                        )}
                        Télécharger
                    </Button>
                    
                    <Button
                        onClick={handlePrint}
                        disabled={isPrinting}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                    >
                        {isPrinting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Printer className={`w-${iconSize} h-${iconSize} mr-2`} />
                        )}
                        Imprimer
                    </Button>
                </div>

                {/* QR Code Content Preview */}
                <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Voir le contenu du code QR
                    </summary>
                    <div className="mt-2 p-2 bg-gray-50 rounded border font-mono text-xs break-all">
                        {JSON.stringify({
                            productId: product.id,
                            imei: product.imei,
                            name: product.name,
                            url: `/products/${product.id}`,
                            created: qrCode.generatedAt
                        }, null, 2)}
                    </div>
                </details>
            </CardContent>
        </Card>
    );
}

// ============================================================================
// QR CODE PREVIEW COMPONENT (Smaller version for cards)
// ============================================================================

interface QRCodePreviewProps {
    product: Product;
    qrCode?: {
        id: string;
        code: string;
        imageData?: string;
    };
    className?: string;
}

export function QRCodePreview({ product, qrCode, className = '' }: QRCodePreviewProps) {
    const [imageError, setImageError] = useState(false);

    if (!qrCode?.imageData || imageError) {
        return (
            <div className={`${className} flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg`}>
                <QrCode className="w-6 h-6 text-gray-400" />
            </div>
        );
    }

    return (
        <div className={`${className} w-16 h-16 border rounded-lg p-1 bg-white`}>
            <Image
                src={qrCode.imageData}
                alt={`QR Code for ${product.name}`}
                width={64}
                height={64}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
            />
        </div>
    );
}
