import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <RoutePlaceholder
      title="Settings"
      description="Manage your account and workspace preferences."
    />
  );
}
