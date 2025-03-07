
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const premiumAvatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2 border-premium-gold/20",
        glowing: "border-2 border-premium-gold/50 shadow-[0_0_15px_rgba(223,189,105,0.5)]",
        glass: "border border-premium-dark-700/50 bg-premium-dark-800/60 backdrop-blur-sm",
      },
      size: {
        default: "h-10 w-10",
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PremiumAvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof premiumAvatarVariants> {}

const PremiumAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  PremiumAvatarProps
>(({ className, variant, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(premiumAvatarVariants({ variant, size, className }))}
    {...props}
  />
));
PremiumAvatar.displayName = AvatarPrimitive.Root.displayName;

const PremiumAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
PremiumAvatarImage.displayName = AvatarPrimitive.Image.displayName;

const PremiumAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-premium-dark-700 text-premium-gold",
      className
    )}
    {...props}
  />
));
PremiumAvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { PremiumAvatar, PremiumAvatarImage, PremiumAvatarFallback };
