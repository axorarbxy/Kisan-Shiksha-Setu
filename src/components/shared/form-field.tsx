"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  renderControl,
}: {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  renderControl: (
    field: ControllerRenderProps<TFieldValues, TName>,
    props: { id: string; invalid: boolean; describedBy?: string },
  ) => ReactNode;
}) {
  const id = `field-${useId()}`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const describedBy =
          [
            description ? `${id}-description` : null,
            fieldState.error ? `${id}-error` : null,
          ]
            .filter(Boolean)
            .join(" ") || undefined;

        return (
          <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            {description && (
              <p
                className="text-muted-foreground text-sm"
                id={`${id}-description`}
              >
                {description}
              </p>
            )}
            {renderControl(field, {
              id,
              invalid: Boolean(fieldState.error),
              describedBy,
            })}
            {fieldState.error?.message && (
              <p
                className="text-destructive text-sm"
                id={`${id}-error`}
                role="alert"
              >
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
