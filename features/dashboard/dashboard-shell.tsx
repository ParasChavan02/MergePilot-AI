"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

interface DashboardSidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const DashboardSidebarContext = createContext<DashboardSidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggleSidebar: () => {}
});

export const useDashboardSidebar = () => useContext(DashboardSidebarContext);

export function DashboardShell({ userName, children }: { userName: string; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Read saved preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mergepilot_dashboard_sidebar_collapsed");
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
        localStorage.setItem("mergepilot_dashboard_sidebar_collapsed", String(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

  return (
    <DashboardSidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar userName={userName} />
        <div className="flex min-w-0 flex-1 flex-col transition-all duration-200">
          <DashboardTopbar userName={userName} />
          <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </DashboardSidebarContext.Provider>
  );
}
