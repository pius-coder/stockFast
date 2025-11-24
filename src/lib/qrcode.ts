// ============================================================================
// QR CODE UTILITY
// Generate QR codes for products using the qrcode package
// ============================================================================

import QRCode from 'qrcode';

/**
 * Generate QR code for a product
 * @param productId - The product ID
 * @param imei - The product IMEI
 * @param productUrl - Optional product URL (defaults to /products/[id])
 * @returns Base64 PNG string for the QR code
 */
export async function generateProductQRCode(
    productId: string,
    imei: string,
    productUrl?: string
): Promise<string> {
    try {
        // Construct QR code content data
        const qrData = {
            productId,
            imei,
            url: productUrl || `/products/${productId}`,
            created: new Date().toISOString()
        };

        // Convert to JSON string for encoding
        const qrContent = JSON.stringify(qrData);

        // Generate QR code as base64 PNG
        const qrCodeBase64 = await QRCode.toDataURL(qrContent, {
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 256
        });

        return qrCodeBase64;

    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Échec de la génération du code QR');
    }
}

/**
 * Generate a simple QR code with basic product info
 * @param productId - The product ID
 * @param productName - The product name
 * @param imei - The product IMEI
 * @returns Base64 PNG string for the QR code
 */
export async function generateSimpleProductQRCode(
    productId: string,
    productName: string,
    imei: string
): Promise<string> {
    try {
        // Simple text content for QR code
        const qrContent = `Produit: ${productName}\nIMEI: ${imei}\nID: ${productId}`;

        // Generate QR code as base64 PNG
        const qrCodeBase64 = await QRCode.toDataURL(qrContent, {
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 256
        });

        return qrCodeBase64;

    } catch (error) {
        console.error('Error generating simple QR code:', error);
        throw new Error('Échec de la génération du code QR simple');
    }
}

/**
 * Validate QR code data
 * @param qrData - Parsed QR code data
 * @returns boolean indicating if the QR data is valid
 */
export function validateQRCodeData(qrData: any): boolean {
    try {
        return (
            qrData &&
            typeof qrData === 'object' &&
            typeof qrData.productId === 'string' &&
            typeof qrData.imei === 'string' &&
            qrData.productId.length > 0 &&
            qrData.imei.length === 15
        );
    } catch (error) {
        return false;
    }
}

/**
 * Extract product information from QR code data
 * @param qrContent - Raw QR code content
 * @returns Parsed product info or null if invalid
 */
export function parseQRCodeContent(qrContent: string): {
    productId: string;
    imei: string;
    url?: string;
    created?: string;
} | null {
    try {
        // Try to parse as JSON first
        try {
            const qrData = JSON.parse(qrContent);
            if (validateQRCodeData(qrData)) {
                return {
                    productId: qrData.productId,
                    imei: qrData.imei,
                    url: qrData.url,
                    created: qrData.created
                };
            }
        } catch (jsonError) {
            // Not JSON, try to parse as text format
        }

        // Try to parse as text format "Produit: X\nIMEI: Y\nID: Z"
        const lines = qrContent.split('\n');
        let productId = '';
        let imei = '';

        for (const line of lines) {
            if (line.startsWith('IMEI:')) {
                imei = line.substring(5).trim();
            } else if (line.startsWith('ID:')) {
                productId = line.substring(3).trim();
            }
        }

        if (productId && imei && imei.length === 15) {
            return {
                productId,
                imei
            };
        }

        return null;

    } catch (error) {
        console.error('Error parsing QR code content:', error);
        return null;
    }
}