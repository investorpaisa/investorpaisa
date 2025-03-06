
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const premiumBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-premium-gold/20 text-premium-gold",
        outline: "border border-premium-gold/30 text-premium-gold",
        glass: "bg-premium-dark-800/60 backdrop-blur-sm border border-premium-dark-700/30 text-foreground",
        filled: "bg-premium-gold text-premium-dark-900",
        success: "bg-emerald-500/20 text-emerald-500",
        warning: "bg-amber-500/20 text-amber-500",
        danger: "bg-red-500/20 text-red-500",
      },
      size: {
        default: "text-xs",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-sm px-3 py-1",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        glow: "animate-pulse-gold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface PremiumBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumBadgeVariants> {}

function PremiumBadge({
  className,
  variant,
  size,
  animation,
  ...props
}: PremiumBadgeProps) {
  return (
    <div
      className={cn(premiumBadgeVariants({ variant, size, animation }), className)}
      {...props}
    />
  );
}

export { PremiumBadge, premiumBadgeVariants };
