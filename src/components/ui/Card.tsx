import React from "react";
import { cn } from "@/lib/utils";

const cardBaseClass = "rounded-3xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: "sm" | "md" | "lg" | "none";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, padding = "md", children, ...props }, ref) => {
        const paddingClass = {
            none: "",
            sm: "p-4",
            md: "p-5 sm:p-6",
            lg: "p-6 sm:p-8",
        }[padding];

        return (
            <div
                ref={ref}
                className={cn(cardBaseClass, paddingClass, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, icon, title, description, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("mb-4", className)} {...props}>
                <h2 className="text-lg font-semibold inline-flex items-center gap-2 text-slate-900 mb-2">
                    {icon}
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-slate-600">{description}</p>
                )}
            </div>
        );
    }
);

CardHeader.displayName = "CardHeader";

export { Card, CardHeader };