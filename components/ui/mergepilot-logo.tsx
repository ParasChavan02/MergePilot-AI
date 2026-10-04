import { cn } from "@/lib/utils";

interface MergePilotLogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  textClassName?: string;
}

export function MergePilotSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-5 shrink-0", className)}
      aria-hidden="true"
    >
      {/* Geometric Git Merge / M Mark */}
      <path
        d="M4 19V6M20 19V6M4 7.5C4 7.5 7.5 12 12 12M20 7.5C20 7.5 16.5 12 12 12M12 12V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="6" r="2" fill="currentColor" />
      <circle cx="20" cy="6" r="2" fill="currentColor" />
      <circle cx="12" cy="19" r="2" fill="currentColor" />
    </svg>
  );
}

export function MergePilotLogo({
  className,
  iconClassName,
  showText = true,
  textClassName
}: MergePilotLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5 tracking-tight select-none", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-colors dark:border-[#262626] dark:bg-[#0A0A0A]">
        <MergePilotSymbol className={cn("h-4 w-4", iconClassName)} />
      </span>
      {showText && (
        <span
          className={cn(
            "font-semibold text-sm tracking-tight text-foreground whitespace-nowrap",
            textClassName
          )}
        >
          MergePilot <span className="font-normal text-muted-foreground">AI</span>
        </span>
      )}
    </div>
  );
}
