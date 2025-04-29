
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-blue disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-cafe-blue text-white hover:bg-cafe-blue-dark": variant === "primary",
            "bg-cafe-gray text-gray-800 hover:bg-cafe-gray-dark hover:text-white": variant === "secondary",
            "border border-cafe-blue text-cafe-blue hover:bg-cafe-blue hover:text-white": variant === "outline",
            "bg-red-500 text-white hover:bg-red-600": variant === "danger",
            "text-sm px-3 py-1.5": size === "sm",
            "text-base px-4 py-2": size === "md",
            "text-lg px-5 py-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
