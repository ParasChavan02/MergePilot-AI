import { DocsShell } from "@/components/docs/docs-shell";

export const metadata = {
  title: {
    default: "Documentation | MergePilot AI",
    template: "%s | MergePilot AI Documentation"
  },
  description:
    "Learn how MergePilot analyzes GitHub pull requests, evaluates risk, identifies test gaps, and generates release notes."
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
