import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { OnboardingFlow } from "@/features/auth/onboarding-flow";

export const metadata: Metadata = { title: "Set up your workspace" };

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="A few details to get started"
        description="This short setup helps us tailor KSS to your role. You can skip any step."
      />
      <OnboardingFlow />
    </div>
  );
}
