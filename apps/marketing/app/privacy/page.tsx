import type { Metadata } from "next";

import { PrivacyContent } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | MergePilot AI",
  description:
    "Understand how MergePilot AI collects, processes, stores, and protects your information, GitHub repository data, and pull request intelligence."
};

export default function MarketingPrivacyPage() {
  return <PrivacyContent />;
}
