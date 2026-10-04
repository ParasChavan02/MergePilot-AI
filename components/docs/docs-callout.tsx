import { AlertCircle, AlertTriangle, Info, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";

interface DocsCalloutProps {
  type?: "note" | "tip" | "warning" | "important";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DocsCallout({ type = "note", title, children, className }: DocsCalloutProps) {
  const config = {
    note: {
      icon: Info,
      defaultTitle: "NOTE"
    },
    tip: {
      icon: Lightbulb,
      defaultTitle: "TIP"
    },
    warning: {
      icon: AlertTriangle,
      defaultTitle: "WARNING"
    },
    important: {
      icon: AlertCircle,
      defaultTitle: "IMPORTANT"
    }
  }[type];

  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={cn(
        "my-6 rounded-xl border border-border/80 bg-muted/40 p-4 text-xs leading-relaxed text-foreground/90 backdrop-blur-xs",
        className
      )}
    >
      <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
        <Icon className="h-4 w-4 shrink-0 text-foreground" />
        <span>{displayTitle}</span>
      </div>
      <div className="mt-2 text-muted-foreground">{children}</div>
    </div>
  );
}
