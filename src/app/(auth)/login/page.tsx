import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { LoginForm } from "@/features/auth/auth-forms";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back"
        description="Log in to continue to your KSS workspace."
      />
      <LoginForm />
    </div>
  );
}
