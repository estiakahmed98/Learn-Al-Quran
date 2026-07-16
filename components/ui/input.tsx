import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
