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
        low: "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
        medium:
          "border-amber-500/25 bg-amber-500/10 font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
        high: "border-orange-500/30 bg-orange-500/10 font-semibold text-orange-800 dark:border-orange-500/35 dark:bg-orange-500/15 dark:text-orange-300",
        critical:
          "border-rose-500/35 bg-rose-500/15 font-semibold text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/25 dark:text-rose-200",
        open: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
        closed:
          "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300",
        merged:
          "border-purple-500/25 bg-purple-500/10 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300",
        draft: "border-border bg-muted/60 text-muted-foreground"
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
