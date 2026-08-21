import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed bg-card/60">
      <CardHeader>
        <CardTitle>No repositories connected yet</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        This dashboard shell is ready for repository syncing, PR ingestion, and AI output once we
        build the product workflows.
      </CardContent>
    </Card>
  );
}
