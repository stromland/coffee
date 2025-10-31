import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Add padding to card content */
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Reusable Card component for content containers
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, header, footer, padding = "md", className = "", ...props }, ref) => {
    const baseStyles = "bg-olive/20 backdrop-blur-sm rounded-lg shadow-2xl";

    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {header && (
          <div className={`border-b border-coffee/20 ${paddingStyles[padding]} pb-4`}>{header}</div>
        )}
        <div className={paddingStyles[padding]}>{children}</div>
        {footer && (
          <div className={`border-t border-coffee/20 ${paddingStyles[padding]} pt-4`}>{footer}</div>
        )}
      </div>
    );
  }
);

Card.displayName = "Card";
