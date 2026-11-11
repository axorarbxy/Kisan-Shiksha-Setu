import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
      <h2 className="font-display text-forest-700 text-3xl">{title}</h2>
      <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}
