import { notFound } from "next/navigation";
import { ComponentsShowcase } from "@/app/(public)/design/components-showcase";

const palettes = [
  {
    name: "Forest",
    colors: [
      ["forest-50", "#EEF5F1"],
      ["forest-100", "#D5E7DC"],
      ["forest-200", "#A9CFB8"],
      ["forest-300", "#78B091"],
      ["forest-400", "#4A8E6B"],
      ["forest-500", "#2F7352"],
      ["forest-600", "#235C42"],
      ["forest-700", "#1C4A37"],
      ["forest-800", "#163B2C"],
      ["forest-900", "#0F2A1F"],
    ],
  },
  {
    name: "Sand",
    colors: [
      ["sand-50", "#FBF8F2"],
      ["sand-100", "#F5EFE3"],
      ["sand-200", "#EBE0CB"],
      ["sand-300", "#DFCFAF"],
      ["sand-400", "#CFB88C"],
      ["sand-500", "#B89B68"],
    ],
  },
  {
    name: "Purple",
    colors: [
      ["purple-100", "#EDE3FF"],
      ["purple-400", "#9A5BFF"],
      ["purple-500", "#7B2FFF"],
      ["purple-600", "#6A1FE6"],
    ],
  },
] as const;

const semanticTokens = [
  ["background", "var(--background)"],
  ["foreground", "var(--foreground)"],
  ["card", "var(--card)"],
  ["card-foreground", "var(--card-foreground)"],
  ["popover", "var(--popover)"],
  ["popover-foreground", "var(--popover-foreground)"],
  ["primary", "var(--primary)"],
  ["primary-foreground", "var(--primary-foreground)"],
  ["secondary", "var(--secondary)"],
  ["secondary-foreground", "var(--secondary-foreground)"],
  ["muted", "var(--muted)"],
  ["muted-foreground", "var(--muted-foreground)"],
  ["accent", "var(--accent)"],
  ["accent-foreground", "var(--accent-foreground)"],
  ["destructive", "var(--destructive)"],
  ["border", "var(--border)"],
  ["input", "var(--input)"],
  ["ring", "var(--ring)"],
] as const;

function Swatch({ name, color }: { name: string; color: string }) {
  return (
    <li className="border-border bg-card overflow-hidden rounded-xl border">
      <div
        aria-label={`${name}: ${color}`}
        className="border-border h-20 border-b"
        style={{ backgroundColor: color }}
      />
      <div className="p-3">
        <p className="text-card-foreground text-sm font-medium">{name}</p>
        <p className="text-muted-foreground text-sm">{color}</p>
      </div>
    </li>
  );
}

export default function DesignPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-16 px-6 py-16 md:py-24">
      <header className="space-y-3">
        <p className="text-primary text-sm font-medium">KSS / Design system</p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Design tokens
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
          Light theme foundations: warm sand, forest green, and a sparing purple
          accent.
        </p>
      </header>

      <section aria-labelledby="palette-heading" className="space-y-8">
        <h2
          className="text-foreground text-xl font-semibold"
          id="palette-heading"
        >
          Palette
        </h2>
        {palettes.map((palette) => (
          <div className="space-y-4" key={palette.name}>
            <h3 className="text-foreground text-base font-medium">
              {palette.name}
            </h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {palette.colors.map(([name, color]) => (
                <Swatch color={color} key={name} name={name} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="semantic-heading" className="space-y-4">
        <h2
          className="text-foreground text-xl font-semibold"
          id="semantic-heading"
        >
          Semantic and shadcn tokens
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {semanticTokens.map(([name, color]) => (
            <Swatch color={color} key={name} name={name} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="type-heading" className="space-y-6">
        <h2 className="text-foreground text-xl font-semibold" id="type-heading">
          Typography
        </h2>
        <div className="border-border bg-card space-y-5 rounded-xl border p-6">
          <p className="font-display text-forest-700 text-5xl md:text-7xl">
            Tempting display sample
          </p>
          <p className="text-card-foreground font-sans text-base">
            Inter body sample — Aa Bb Cc 0123456789
          </p>
          <h1 className="text-card-foreground text-3xl font-semibold tracking-tight">
            H1 — Page title
          </h1>
          <h2 className="text-card-foreground text-xl font-semibold">
            H2 — Section title
          </h2>
          <p className="text-card-foreground text-base leading-relaxed">
            Body — Generous line-height for comfortable reading.
          </p>
          <p className="text-muted-foreground text-sm">
            Caption — Helper text and secondary information.
          </p>
        </div>
      </section>

      <ComponentsShowcase />
    </main>
  );
}
