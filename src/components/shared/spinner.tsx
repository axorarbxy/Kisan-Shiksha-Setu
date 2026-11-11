import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      aria-label={label}
      className={cn(
        "text-muted-foreground inline-flex items-center gap-2",
        className,
      )}
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
