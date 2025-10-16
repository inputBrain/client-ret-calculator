import React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
                secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus-visible:ring-indigo-200",
                outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-indigo-200",
                ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-indigo-200",
                paypal: "bg-sky-500 text-white hover:bg-sky-600 focus-visible:ring-sky-400",
                bmac: "bg-yellow-400 text-black hover:bg-yellow-300 focus-visible:ring-yellow-300",
                active: "bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-sm",
            },
            size: {
                sm: "px-3 py-1.5 text-sm",
                md: "px-4 py-2 text-sm",
                lg: "px-5 py-3 text-sm",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isActive?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isActive, children, ...props }, ref) => {
        const finalVariant = isActive ? "active" : variant;

        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant: finalVariant, size }), className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };