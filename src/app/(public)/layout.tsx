import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { publicNavItems } from "@/config/nav";
import { Button } from "@/components/ui/button";
import { publicFooterCopy } from "@/content/public-pages";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-background/95 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo hideTextOnMobile />
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
            <Button asChild size="sm" variant="outline">
              <Link href="/register?role=mentor">Join the pilot</Link>
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
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {publicFooterCopy.affiliation}
            </p>
            {contactEmail ? (
              <a
                className="inline-block text-sm text-forest-700 underline decoration-sand-400 underline-offset-4 hover:text-forest-900"
                href={`mailto:${contactEmail}`}
              >
                {publicFooterCopy.contactLabel}
              </a>
            ) : (
              <Link
                className="inline-block text-sm text-forest-700 underline decoration-sand-400 underline-offset-4 hover:text-forest-900"
                href={publicFooterCopy.contactHref}
              >
                {publicFooterCopy.contactFallback}
              </Link>
            )}
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            {publicNavItems.map((item) => (
              <Link
                className="transition-colors hover:text-forest-700"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="transition-colors hover:text-forest-700"
              href="/register?role=mentor"
            >
              Join the pilot
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
