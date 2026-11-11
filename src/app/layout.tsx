import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: {
    default: "Kisan Shiksha Setu",
    template: "%s · Kisan Shiksha Setu",
  },
  description:
    "Agriculture students teach rural classrooms through practical community farm experiments.",
  openGraph: {
    siteName: "Kisan Shiksha Setu",
    title: "Kisan Shiksha Setu",
    description:
      "Agriculture students teach rural classrooms through practical community farm experiments.",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
