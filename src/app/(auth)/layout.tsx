import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-sand-50 flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Logo className="mb-8" />
      <section className="border-border w-full max-w-md rounded-xl border bg-white p-6 sm:p-8">
        {children}
      </section>
    </main>
  );
}
