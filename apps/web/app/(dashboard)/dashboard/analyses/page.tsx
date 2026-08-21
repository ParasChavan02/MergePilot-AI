import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalysesPage() {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Analyses</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Analysis history will appear here once PR ingestion and AI processing are wired up.
      </CardContent>
    </Card>
  );
}
