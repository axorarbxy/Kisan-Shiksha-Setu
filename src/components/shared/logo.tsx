import Link from "next/link";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  hideTextOnMobile = false,
}: {
  className?: string;
  hideTextOnMobile?: boolean;
}) {
  return (
    <Link
      aria-label="Kisan Shiksha Setu home"
      className={cn(
        "text-forest-700 focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-lg outline-none focus-visible:ring-[3px]",
        className,
      )}
      href="/"
    >
      <Sprout aria-hidden="true" className="size-5 shrink-0" />
      <span
        className={`font-sans text-xl font-semibold tracking-tight ${hideTextOnMobile ? "hidden sm:inline" : ""}`}
      >
        Kisan Shiksha Setu
      </span>
    </Link>
  );
}
