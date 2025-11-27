import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <AlertCircle className="h-16 w-16 text-red-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4 text-center max-w-md">
                {error}
            </p>
            <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
            </Button>
        </div>
    );
}
