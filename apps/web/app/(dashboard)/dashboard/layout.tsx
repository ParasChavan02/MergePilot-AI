import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/dashboard-topbar";
import { auth } from "@/server/auth";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <DashboardSidebar userName={session.user.name ?? "Developer"} />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar userName={session.user.name ?? "Developer"} />
          <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
