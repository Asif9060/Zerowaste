import { cn } from "@/lib/utils";
import type { Currency } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency: Currency;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CurrencyDisplay({ amount, currency, className, size = "md" }: CurrencyDisplayProps) {
  return (
    <span
      className={cn(
        "font-bold tabular-nums",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-2xl",
        className
      )}
    >
      {formatCurrency(amount, currency)}
    </span>
  );
}
