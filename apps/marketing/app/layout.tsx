import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Footer } from "@/features/marketing/footer";
import { Navbar } from "@/features/marketing/navbar";

export const metadata: Metadata = {
  title: "MergePilot AI | AI-Powered GitHub PR Intelligence",
  description:
    "Understand Pull Requests before you merge them. Comprehensive PR risk scoring, breaking change detection, and test gap audits.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function MarketingLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-foreground/20">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
