import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-neuro-bg text-foreground shadow-neuro-flat hover:shadow-neuro-pressed active:shadow-neuro-pressed transform hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-neuro-bg text-destructive shadow-neuro-flat hover:shadow-neuro-pressed active:shadow-neuro-pressed transform hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-input bg-neuro-bg shadow-neuro-flat hover:shadow-neuro-pressed active:shadow-neuro-pressed transform hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-neuro-bg text-secondary-foreground shadow-neuro-flat hover:shadow-neuro-pressed active:shadow-neuro-pressed transform hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "hover:bg-neuro-bg/80 hover:shadow-neuro-flat transform hover:-translate-y-0.5 active:translate-y-0",
        link: "text-neuro-primary underline-offset-4 hover:underline",
        neuro:
          "bg-neuro-bg text-foreground shadow-neuro-flat hover:shadow-neuro-pressed active:shadow-neuro-pressed transform hover:-translate-y-0.5 active:translate-y-0",
        "neuro-convex":
          "bg-neuro-bg text-foreground shadow-neuro-convex hover:shadow-neuro-pressed active:shadow-neuro-pressed transform hover:-translate-y-0.5 active:translate-y-0",
        "neuro-concave":
          "bg-neuro-bg text-foreground shadow-neuro-concave hover:shadow-neuro-pressed active:shadow-neuro-pressed transform hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "neuro",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
