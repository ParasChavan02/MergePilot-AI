import type { ReactNode } from "react";

import { Footer } from "@/features/marketing/footer";
import { Navbar } from "@/features/marketing/navbar";

export default function MarketingLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
