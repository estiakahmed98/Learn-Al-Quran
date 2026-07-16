import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
        variant === "outline"
          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          : variant === "destructive"
            ? "bg-red-600 text-white hover:bg-red-700 px-4"
            : "bg-primary px-4 text-white hover:bg-primary-dark",
        size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
