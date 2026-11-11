import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Join the pilot" };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Join the pilot"
        description="Create an account to take part in Kisan Shiksha Setu."
      />
      <p className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          className="text-forest-700 font-medium underline-offset-4 hover:underline"
          href="/login"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
