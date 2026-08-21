import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Connect GitHub OAuth and land in a protected dashboard.",
  "Select a repository and sync pull requests.",
  "Generate summaries, risk signals, and release notes."
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="flex items-center gap-3">
        <Badge>How it works</Badge>
        <p className="text-sm text-muted-foreground">Designed for a small MVP that can scale into a platform.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step} className="bg-card/80">
            <CardHeader>
              <p className="text-sm text-muted-foreground">Step {index + 1}</p>
              <CardTitle>{step}</CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}
