import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { generateProductQRCode } from '@/lib/qrcode';

export async function POST(request: NextRequest) {
    try {
        console.log('QR regeneration API called');
        
        // Check authentication
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            console.log('QR regeneration: No session found');
            return NextResponse.json(
                { success: false, error: 'Authentification requise' },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log('QR regeneration request body:', body);
        const { productId, qrCodeId } = body;

        if (!productId || !qrCodeId) {
            console.log('QR regeneration: Missing productId or qrCodeId');
            return NextResponse.json(
                { success: false, error: 'ID du produit et ID du code QR requis' },
                { status: 400 }
            );
        }

        // Get product and QR code
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { qrCode: true }
        });

        console.log('QR regeneration: Found product:', !!product);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        if (!product.qrCode || product.qrCode.id !== qrCodeId) {
            console.log('QR regeneration: QR code not found or ID mismatch');
            return NextResponse.json(
                { success: false, error: 'Code QR non trouvé' },
                { status: 404 }
            );
        }

        console.log('QR regeneration: Starting QR code generation');
        // Generate new QR code image data
        const qrCodeImageData = await generateProductQRCode(product.id, product.imei);
        console.log('QR regeneration: Generated image data, length:', qrCodeImageData.length);

        // Update QR code with new image data
        const updatedQRCode = await prisma.qRCode.update({
            where: { id: qrCodeId },
            data: {
                imageData: qrCodeImageData,
                generatedAt: new Date()
            }
        });

        console.log('QR regeneration: Successfully updated QR code');

        return NextResponse.json({
            success: true,
            data: updatedQRCode,
            message: 'Code QR régénéré avec succès'
        });

    } catch (error) {
        console.error('Error regenerating QR code:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la régénération du code QR' },
            { status: 500 }
        );
    }
}
