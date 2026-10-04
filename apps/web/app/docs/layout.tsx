import { DocsHeader } from "@/components/docs/docs-header";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export const metadata = {
  title: {
    default: "Documentation | MergePilot AI",
    template: "%s | MergePilot AI Documentation"
  },
  description:
    "Learn how MergePilot analyzes GitHub pull requests, evaluates risk, identifies test gaps, and generates release notes."
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DocsHeader />
      <DocsMobileNav />

      <div className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Sidebar */}
        <div className="hidden w-60 shrink-0 border-r border-border/60 py-8 pr-4 md:block lg:w-64 lg:pr-6">
          <div className="scrollbar-thin sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden pr-2">
            <DocsSidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 py-6 sm:py-8 md:pl-8 lg:pl-10">{children}</main>
      </div>
    </div>
  );
}
