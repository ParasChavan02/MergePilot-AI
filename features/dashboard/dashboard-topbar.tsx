import Link from "next/link";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dashboardNav } from "@/config/navigation";
import { ThemeToggle } from "@/components/providers/theme-toggle";

export function DashboardTopbar({ userName }: Readonly<{ userName: string }>) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="font-medium">{userName}</p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Separator orientation="vertical" className="h-6" />
          <form action={logout}>
            <Button type="submit" variant="ghost">
              Logout
            </Button>
          </form>
        </div>
        <details className="relative md:hidden">
          <summary className="list-none rounded-full border border-border bg-card px-3 py-2 text-sm">
            Menu
          </summary>
          <div className="absolute right-0 top-12 w-56 rounded-2xl border border-border bg-card p-2 shadow-soft">
            {dashboardNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <form action={logout} className="mt-2">
              <Button type="submit" variant="outline" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </details>
      </div>
    </header>
  );
}
