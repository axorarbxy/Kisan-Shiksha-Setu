import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div
        aria-busy="true"
        aria-label="Loading form"
        className="border-border w-full max-w-md space-y-4 rounded-xl border bg-white p-8"
        role="status"
      >
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </main>
  );
}
