
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const premiumButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-premium-gold/50 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-premium-gold to-premium-gold/80 text-premium-dark-900 shadow-md hover:shadow-premium",
        outline: "border border-premium-gold/30 bg-transparent text-premium-gold hover:bg-premium-gold/10",
        ghost: "bg-transparent text-foreground/80 hover:text-foreground",
        link: "bg-transparent text-premium-gold underline-offset-4 hover:underline p-0 h-auto",
        glass: "bg-premium-dark-800/60 backdrop-blur-md border border-premium-dark-700/30 text-foreground hover:border-premium-gold/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-1.5 text-sm",
        lg: "h-12 px-6 py-3 text-lg",
        icon: "h-10 w-10 p-0",
      },
      animation: {
        none: "",
        hover: "transform hover:-translate-y-1",
        pulse: "animate-pulse-gold",
        glow: "hover:shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "hover",
    },
  }
);

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  asChild?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(premiumButtonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export { PremiumButton, premiumButtonVariants };
