import { CtaSection } from "@/features/marketing/cta-section";
import { FeatureSection } from "@/features/marketing/feature-section";
import { HeroSection } from "@/features/marketing/hero-section";
import { HowItWorksSection } from "@/features/marketing/how-it-works-section";

export default function MarketingHomePage() {
  return (
    <main>
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <CtaSection />
    </main>
  );
}
