import { cn } from "@/lib/utils";
import type { Urgency } from "@/types";
import { URGENCY_CONFIG } from "@/types";

interface UrgencyBadgeProps {
  urgency: Urgency;
  showLabel?: boolean;
  className?: string;
}

export function UrgencyBadge({ urgency, showLabel = true, className }: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[urgency];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.bgColor,
        config.color,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          urgency === "critical" && "bg-red-500 animate-pulse",
          urgency === "high" && "bg-orange-500",
          urgency === "medium" && "bg-amber-500",
          urgency === "low" && "bg-green-600"
        )}
      />
      {showLabel && config.label}
    </span>
  );
}
