import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import "@/app/globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-screen bg-background font-sans text-foreground")}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
