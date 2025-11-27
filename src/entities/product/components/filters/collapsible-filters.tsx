import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CollapsibleFiltersProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export function CollapsibleFilters({ title, children, defaultOpen = true, className }: CollapsibleFiltersProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Card className={className}>
            <CardHeader
                className="pb-3 cursor-pointer select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>{title}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
            </CardHeader>
            {isOpen && <CardContent className="pt-0">{children}</CardContent>}
        </Card>
    );
}
