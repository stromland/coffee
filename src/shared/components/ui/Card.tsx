import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional title for the card header */
  title?: string;
  /** Optional header content (overrides title if both provided) */
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
  ({ children, title, header, footer, padding = "md", className = "", ...props }, ref) => {
    const baseStyles = "bg-olive/20 backdrop-blur-sm rounded-lg shadow-2xl";

    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    // If title is provided and no custom header, create default header with title
    const headerContent =
      header ||
      (title && (
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-cream">{title}</h2>
        </div>
      ));

    return (
      <div ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {headerContent && (
          <div className={`${paddingStyles[padding]} pb-0 mb-2`}>{headerContent}</div>
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
