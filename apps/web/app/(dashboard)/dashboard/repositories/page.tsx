import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RepositoriesPage() {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Repositories</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Repository syncing is not implemented yet. This route exists so the dashboard navigation has a stable shell.
      </CardContent>
    </Card>
  );
}
