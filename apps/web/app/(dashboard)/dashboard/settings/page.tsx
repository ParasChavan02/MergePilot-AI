import { Cog, Sliders, Bell, Key } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Configuration
          </p>
          <Badge variant="outline" className="text-[10px]">
            Coming Soon
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Settings</h1>
        <p className="text-xs text-muted-foreground md:text-sm">
          Workspace preferences and automation settings are currently in development.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card dark:border-[#262626] dark:bg-[#0A0A0A]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-muted-foreground" />
                Custom Risk Engine Rules
              </span>
              <Badge variant="outline" className="text-[10px]">
                Roadmap
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-muted-foreground">
            Configure custom file paths, severity multipliers, and directory-specific risk policies
            tailored to your team&apos;s monorepo architecture.
          </CardContent>
        </Card>

        <Card className="border-border bg-card dark:border-[#262626] dark:bg-[#0A0A0A]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                GitHub Token & App
              </span>
              <Badge variant="outline" className="text-[10px]">
                Managed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-muted-foreground">
            Your GitHub account OAuth credentials are encrypted and scoped server-side with read
            permissions for repository and pull request inspection.
          </CardContent>
        </Card>

        <Card className="border-border bg-card dark:border-[#262626] dark:bg-[#0A0A0A]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Review Notifications
              </span>
              <Badge variant="outline" className="text-[10px]">
                Roadmap
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-muted-foreground">
            Automatic PR intelligence reports sent to Slack, Discord, or GitHub PR summary comments
            when high-risk changes are submitted.
          </CardContent>
        </Card>

        <Card className="border-border bg-card dark:border-[#262626] dark:bg-[#0A0A0A]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <Cog className="h-4 w-4 text-muted-foreground" />
                Model & AI Temperature
              </span>
              <Badge variant="outline" className="text-[10px]">
                v1.0 Standard
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-muted-foreground">
            MergePilot is currently powered by Gemini 2.5 Flash with strict JSON schema enforcement
            and zero-hallucination prompting constraints.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
