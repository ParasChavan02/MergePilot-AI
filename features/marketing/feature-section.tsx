import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "AI summaries",
    description: "Compress noisy diffs into a concise, readable summary for humans."
  },
  {
    title: "Risk analysis",
    description: "Highlight areas that deserve more scrutiny before merge time."
  },
  {
    title: "Breaking change detection",
    description: "Surface potential interface and behavior breaks early."
  },
  {
    title: "Test suggestions",
    description: "Recommend targeted validation for changed code paths."
  },
  {
    title: "Release notes",
    description: "Draft release-ready notes from merged changes."
  },
  {
    title: "Production ready",
    description: "Built with strict typing, auth, schema design, and SaaS foundations."
  }
] as const;

export function FeatureSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="flex items-center gap-3">
        <Badge>Features</Badge>
        <p className="text-sm text-muted-foreground">Minimal surface area, maximum signal.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="bg-card/80">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}
