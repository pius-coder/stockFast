"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface ProductSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
    disabled?: boolean;
}

export function ProductSearchInput({
    value,
    onChange,
    onClear,
    placeholder = "Rechercher un produit...",
    disabled = false,
}: ProductSearchInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative">
            <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                    isFocused ? "text-primary" : "text-muted-foreground"
                }`}
            />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                className="pl-10 pr-10"
            />
            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
}
