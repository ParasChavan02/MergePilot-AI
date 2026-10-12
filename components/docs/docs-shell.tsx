"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { DocsHeader } from "./docs-header";
import { DocsMobileNav } from "./docs-mobile-nav";
import { DocsSidebar } from "./docs-sidebar";

import { cn } from "@/lib/utils";

interface DocsSidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const DocsSidebarContext = createContext<DocsSidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggleSidebar: () => {}
});

export const useDocsSidebar = () => useContext(DocsSidebarContext);

export function DocsShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mergepilot_docs_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("mergepilot_docs_sidebar_collapsed", String(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

  return (
    <DocsSidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      <div className="min-h-screen bg-background text-foreground">
        <DocsHeader />
        <DocsMobileNav />

        <div className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Desktop Sidebar with ChatGPT Toggle */}
          {!collapsed && (
            <div className="hidden w-60 shrink-0 border-r border-border/60 py-6 pr-4 md:block lg:w-64 lg:pr-6">
              <div className="scrollbar-thin sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden pr-2">
                <DocsSidebar />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main
            className={cn(
              "min-w-0 flex-1 py-6 sm:py-8 transition-all duration-200",
              collapsed ? "mx-auto max-w-4xl px-2 sm:px-4" : "md:pl-8 lg:pl-10"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </DocsSidebarContext.Provider>
  );
}
