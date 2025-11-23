"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormFieldConfig } from "../../components/sign-up-config";

interface AuthFormFieldProps<T extends FieldValues> {
    config: FormFieldConfig;
    control: Control<T>;
}

export function AuthFormField<T extends FieldValues>({
    config,
    control,
}: AuthFormFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={config.name as Path<T>}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{config.label}</FormLabel>
                    <FormControl>
                        <Input
                            type={config.type === "password" ? "password" : config.type === "email" ? "email" : "text"}
                            placeholder={config.placeholder}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
