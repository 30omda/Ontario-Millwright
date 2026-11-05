import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-(--ease-smooth) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 disabled:pointer-events-none disabled:opacity-60 active:translate-y-px [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-yellow-500 text-navy-950 hover:bg-[#ffc642]",
        secondary: "border border-steel-300 bg-white text-navy-900 font-medium hover:border-navy-900",
        dark: "bg-navy-900 text-white font-medium hover:bg-navy-800",
        ghostDark: "border-[1.5px] border-white/70 bg-white/8 text-white hover:bg-white/16",
        info: "border border-blue-200 bg-blue-50 text-blue-800 hover:bg-[#d3e5f8]",
        link: "rounded-none px-0 font-medium text-navy-900 shadow-[inset_0_-2px_0_var(--color-yellow-500)] hover:text-yellow-700",
      },
      size: {
        sm: "min-h-11 px-4 text-[13px]",
        md: "min-h-11 px-5 text-sm",
        lg: "min-h-13 px-6.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
