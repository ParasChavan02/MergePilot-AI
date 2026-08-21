"use client";

import type { ReactNode } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="mergepilot-theme">
      {children}
    </NextThemesProvider>
  );
}
