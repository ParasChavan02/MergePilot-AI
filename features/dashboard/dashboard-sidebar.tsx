import Link from "next/link";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { dashboardNav } from "@/config/navigation";

export function DashboardSidebar({ userName }: Readonly<{ userName: string }>) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-card/40 p-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold">
          MP
        </div>
        <div>
          <p className="font-semibold">MergePilot AI</p>
          <p className="text-sm text-muted-foreground">{userName}</p>
        </div>
      </div>
      <nav className="mt-8 space-y-1">
        {dashboardNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full">
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}
