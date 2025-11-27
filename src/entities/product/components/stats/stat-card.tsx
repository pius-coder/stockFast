import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        type: 'increase' | 'decrease' | 'neutral';
    };
    icon: React.ElementType;
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
    className?: string;
    loading?: boolean;
    onClick?: () => void;
}

export function StatCard({
    title,
    value,
    change,
    icon: Icon,
    variant = 'default',
    className,
    loading = false,
    onClick
}: StatCardProps) {
    if (loading) {
        return (
            <Card className={className}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return 'border-green-200 bg-green-50/50';
            case 'warning':
                return 'border-orange-200 bg-orange-50/50';
            case 'destructive':
                return 'border-red-200 bg-red-50/50';
            case 'info':
                return 'border-blue-200 bg-blue-50/50';
            default:
                return 'border-gray-200';
        }
    };

    const getIconStyles = () => {
        switch (variant) {
            case 'success':
                return 'text-green-600 bg-green-100';
            case 'warning':
                return 'text-orange-600 bg-orange-100';
            case 'destructive':
                return 'text-red-600 bg-red-100';
            case 'info':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getChangeIcon = () => {
        if (!change) return null;

        switch (change.type) {
            case 'increase':
                return <ArrowUp className="h-3 w-3 text-green-600" />;
            case 'decrease':
                return <ArrowDown className="h-3 w-3 text-red-600" />;
            case 'neutral':
                return <Minus className="h-3 w-3 text-gray-600" />;
        }
    };

    const getChangeStyles = () => {
        if (!change) return '';

        switch (change.type) {
            case 'increase':
                return 'text-green-600 bg-green-100';
            case 'decrease':
                return 'text-red-600 bg-red-100';
            case 'neutral':
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <Card
            className={`${getVariantStyles()} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            {change && (
                                <Badge
                                    variant="secondary"
                                    className={`text-xs ${getChangeStyles()}`}
                                >
                                    <div className="flex items-center gap-1">
                                        {getChangeIcon()}
                                        {Math.abs(change.value)}%
                                    </div>
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className={`p-3 rounded-full ${getIconStyles()}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
