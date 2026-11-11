import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back"
        description="Log in to continue to your KSS workspace."
      />
      <p className="text-muted-foreground text-sm">
        New to KSS?{" "}
        <Link
          className="text-forest-700 font-medium underline-offset-4 hover:underline"
          href="/register"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
