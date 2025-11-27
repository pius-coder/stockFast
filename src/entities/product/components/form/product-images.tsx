"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "../image-upload";

interface ProductImagesProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
}

export function ProductImages({ images, onImagesChange }: ProductImagesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Images du produit</CardTitle>
                <CardDescription>
                    Ajoutez des images pour votre produit
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ImageUpload
                    images={images}
                    onImagesChange={onImagesChange}
                    maxImages={5}
                    aspectRatio="square"
                />
            </CardContent>
        </Card>
    );
}
