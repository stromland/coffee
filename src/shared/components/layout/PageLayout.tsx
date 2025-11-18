import React from "react";

export interface PageLayoutProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Header actions (e.g., buttons) */
  actions?: React.ReactNode;
  /** Page content */
  children: React.ReactNode;
  /** Maximum width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

/**
 * PageLayout component for consistent page structure
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  actions,
  children,
  maxWidth = "xl",
}) => {
  const maxWidthStyles = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div className={`mx-auto px-4 py-8 ${maxWidthStyles[maxWidth]} animate-fade-in`}>
      {(title || description || actions) && (
        <div className="mb-8 animate-slide-down">
          <div className="flex items-start justify-between gap-4 mb-2">
            {title && (
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-coffee via-caramel to-coffee rounded-full shadow-glow-coffee"></div>
                <h1 className="text-3xl font-bold text-cream dark:text-cream">{title}</h1>
              </div>
            )}
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
          {description && <p className="text-caramel dark:text-caramel ml-7">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
