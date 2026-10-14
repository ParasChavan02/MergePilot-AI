import type { Metadata } from "next";

import { TermsContent } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "Terms of Service | MergePilot AI",
  description:
    "Review the Terms of Service governing the use of the MergePilot AI platform, GitHub pull request intelligence features, and AI-assisted engineering tools."
};

export default function MarketingTermsPage() {
  return <TermsContent />;
}
