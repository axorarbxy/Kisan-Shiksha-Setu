import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { publicNavItems } from "@/config/nav";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-background/95 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {publicNavItems.map((item) => (
              <Button asChild key={item.href} size="sm" variant="ghost">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" variant="accent">
              <Link href="/register">Join pilot</Link>
            </Button>
          </div>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 md:hidden"
        >
          {publicNavItems.map((item) => (
            <Button asChild key={item.href} size="sm" variant="ghost">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-border bg-sand-100 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>Techno-Social Competition &apos;26</span>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <Link
              className="hover:text-forest-700 transition-colors"
              href="/how-it-works"
            >
              How it works
            </Link>
            <Link
              className="hover:text-forest-700 transition-colors"
              href="/evidence"
            >
              Evidence
            </Link>
            <Link
              className="hover:text-forest-700 transition-colors"
              href="/survey"
            >
              Survey
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
