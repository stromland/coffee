import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Full width button */
  fullWidth?: boolean;
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * Reusable Button component with consistent styling
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium " +
      "transition-all duration-200 ease-in-out " +
      "focus:outline-none focus:ring-2 focus:ring-coffee/50 focus:ring-offset-2 " +
      "focus:ring-offset-cream-light dark:focus:ring-offset-olive-dark " +
      "disabled:opacity-50 disabled:cursor-not-allowed " +
      "transform hover:-translate-y-0.5 active:translate-y-0 " +
      "hover:scale-105 active:scale-95";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-coffee to-coffee/90 dark:from-coffee dark:to-coffee/90 " +
        "text-white dark:text-cream " +
        "shadow-depth-2-light dark:shadow-depth-2 " +
        "hover:from-coffee/90 hover:to-coffee dark:hover:from-coffee/90 dark:hover:to-coffee " +
        "hover:shadow-depth-3-light dark:hover:shadow-depth-3 " +
        "active:shadow-depth-1-light dark:active:shadow-depth-1",
      secondary:
        "bg-white/60 dark:bg-olive/30 " +
        "hover:bg-white/80 dark:hover:bg-olive/40 " +
        "border border-coffee/50 dark:border-coffee/50 " +
        "text-olive-dark dark:text-cream " +
        "shadow-depth-1-light dark:shadow-depth-1 " +
        "hover:shadow-depth-2-light dark:hover:shadow-depth-2 " +
        "backdrop-blur-sm",
      danger:
        "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-600 dark:to-red-700 " +
        "text-white dark:text-white " +
        "shadow-depth-2-light dark:shadow-depth-2 " +
        "hover:from-red-700 hover:to-red-800 dark:hover:from-red-700 dark:hover:to-red-800 " +
        "hover:shadow-depth-3-light dark:hover:shadow-depth-3",
      ghost:
        "bg-transparent dark:bg-transparent " +
        "text-olive dark:text-caramel " +
        "hover:text-coffee dark:hover:text-cream " +
        "hover:bg-olive/10 dark:hover:bg-olive/20 " +
        "backdrop-blur-sm",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
