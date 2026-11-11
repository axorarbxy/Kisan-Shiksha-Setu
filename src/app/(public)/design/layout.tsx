import type { ReactNode } from "react";
import { AppProviders } from "@/app/providers";

export default function DesignLayout({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
