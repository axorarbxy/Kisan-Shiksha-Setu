import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { RegisterForm } from "@/features/auth/auth-forms";

export const metadata: Metadata = { title: "Join the pilot" };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Join the pilot"
        description="Create an account to take part in Kisan Shiksha Setu."
      />
      <RegisterForm />
    </div>
  );
}
