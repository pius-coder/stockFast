"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImageUploadProps {
    value?: string[]
    onChange?: (images: string[]) => void
    maxImages?: number
    maxSizeMB?: number
    disabled?: boolean
}

export function ImageUpload({
    value = [],
    onChange,
    maxImages = 5,
    maxSizeMB = 5,
    disabled = false,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const images = useMemo(() => value || [], [value])

    // Validate file
    const validateFile = useCallback((file: File): string | null => {
        // Check file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!validTypes.includes(file.type)) {
            return "Format non supporté. Utilisez JPEG, PNG ou WebP uniquement."
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        if (file.size > maxSizeBytes) {
            return `L'image dépasse la taille maximale de ${maxSizeMB}MB.`
        }

        return null
    }, [maxSizeMB])

    // Convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    // Process files
    const processFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files)

        // Check total images limit
        if (images.length + fileArray.length > maxImages) {
            toast.error(`Vous ne pouvez ajouter que ${maxImages} images maximum.`)
            return
        }

        setIsProcessing(true)
        setProcessingProgress(0)

        const newImages: string[] = []
        const totalFiles = fileArray.length

        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i]

            // Validate file
            const error = validateFile(file)
            if (error) {
                toast.error(error)
                continue
            }

            try {
                // Convert to base64
                const base64 = await fileToBase64(file)
                newImages.push(base64)

                // Update progress
                setProcessingProgress(Math.round(((i + 1) / totalFiles) * 100))
            } catch (error) {
                console.error("Error processing file:", error)
                toast.error(`Erreur lors du traitement de ${file.name}`)
            }
        }

        // Update images
        if (newImages.length > 0) {
            onChange?.([...images, ...newImages])
            toast.success(`${newImages.length} image(s) ajoutée(s) avec succès`)
        }

        setIsProcessing(false)
        setProcessingProgress(0)
    }, [images, maxImages, onChange, validateFile])

    // Handle drag events
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) {
            setIsDragging(true)
        }
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            if (disabled) return

            const files = e.dataTransfer.files
            if (files.length > 0) {
                processFiles(files)
            }
        },
        [disabled, processFiles]
    )

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            processFiles(files)
        }
        // Reset input value to allow selecting the same file again
        e.target.value = ""
    }

    // Remove image
    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        onChange?.(newImages)
        toast.success("Image supprimée")
    }

    // Clear all images
    const clearAll = () => {
        onChange?.([])
        toast.success("Toutes les images ont été supprimées")
    }

    // Open file browser
    const openFileBrowser = () => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileBrowser}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
                    "hover:border-primary/50 hover:bg-accent/5",
                    isDragging && "border-primary bg-primary/5 scale-[1.02]",
                    disabled && "opacity-50 cursor-not-allowed",
                    images.length >= maxImages && "opacity-50 cursor-not-allowed"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileInputChange}
                    disabled={disabled || images.length >= maxImages}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    {isProcessing ? (
                        <>
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Traitement des images... {processingProgress}%
                                </p>
                                <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${processingProgress}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Glissez-déposez vos images ici
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ou cliquez pour parcourir
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    JPEG, PNG, WebP • Max {maxSizeMB}MB • {images.length}/{maxImages} images
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                            Images ({images.length}/{maxImages})
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            disabled={disabled}
                        >
                            Tout effacer
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
                            >
                                <Image
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay with delete button */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeImage(index)
                                        }}
                                        disabled={disabled}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Image number badge */}
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {images.length === 0 && !isProcessing && (
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                        Aucune image ajoutée
                    </p>
                </div>
            )}
        </div>
    )
}
