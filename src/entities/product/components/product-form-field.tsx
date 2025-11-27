"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Control, FieldValues, Path } from "react-hook-form";
import { ProductFormFieldConfig } from "./product-form-config";

interface ProductFormFieldProps<T extends FieldValues> {
    config: ProductFormFieldConfig;
    control: Control<T>;
}

export function ProductFormField<T extends FieldValues>({
    config,
    control,
}: ProductFormFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={config.name as Path<T>}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {config.label}
                        {config.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div>
                            {config.type === "input" && (
                                <Input
                                    type="text"
                                    placeholder={config.placeholder}
                                    {...field}
                                />
                            )}
                            {config.type === "number" && (
                                <Input
                                    type="number"
                                    placeholder={config.placeholder}
                                    {...field}
                                />
                            )}
                            {config.type === "imei" && (
                                <Input
                                    type="text"
                                    placeholder={config.placeholder}
                                    maxLength={15}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    {...field}
                                />
                            )}
                            {config.type === "textarea" && (
                                <Textarea
                                    placeholder={config.placeholder}
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            )}
                            {config.type === "select" && config.options && (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={config.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {config.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </FormControl>
                    {config.description && (
                        <FormDescription>
                            {config.description}
                        </FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}