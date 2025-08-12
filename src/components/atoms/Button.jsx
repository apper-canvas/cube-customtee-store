import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-accent to-amber-500 text-white hover:brightness-110 shadow-lg",
    secondary: "bg-white text-secondary border border-gray-200 hover:bg-gray-50",
    outline: "border border-accent text-accent hover:bg-accent hover:text-white",
    ghost: "text-secondary hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-sm font-medium",
    lg: "px-8 py-3 text-base font-medium"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;