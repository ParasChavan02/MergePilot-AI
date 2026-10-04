import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/60 text-muted-foreground",
        secondary: "border-border bg-muted text-foreground",
        outline: "border-border text-foreground",
        low: "border-border bg-muted/50 text-muted-foreground",
        medium:
          "border-zinc-300 bg-zinc-100 font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200",
        high: "border-zinc-400 bg-zinc-200 font-semibold text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100",
        critical:
          "shadow-xs border-zinc-900 bg-zinc-900 font-semibold text-white dark:border-zinc-200 dark:bg-zinc-100 dark:text-zinc-900",
        open: "border-zinc-700/60 bg-zinc-800/30 text-zinc-200",
        closed: "border-zinc-800/60 bg-zinc-900/40 text-zinc-500",
        merged: "border-zinc-700/60 bg-zinc-800/40 text-zinc-300",
        draft: "border-zinc-800/60 bg-zinc-900/40 text-zinc-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
