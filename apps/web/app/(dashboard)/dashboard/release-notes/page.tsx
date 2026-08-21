import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReleaseNotesPage() {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Release Notes</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Draft release notes will be generated from merged pull requests in a later phase.
      </CardContent>
    </Card>
  );
}
