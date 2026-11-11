import type { Metadata } from "next";
import { AppProviders } from "@/app/providers";
import { inter } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kisan Shiksha Setu",
  description: "Connecting learners with education opportunities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
