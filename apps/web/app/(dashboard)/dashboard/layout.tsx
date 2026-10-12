import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardShell } from "@/features/dashboard/dashboard-shell";
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

  return <DashboardShell userName={session.user.name ?? "Developer"}>{children}</DashboardShell>;
}
