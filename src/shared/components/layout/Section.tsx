import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Header actions */
  actions?: React.ReactNode;
  /** Section content */
  children: React.ReactNode;
}

/**
 * Section component for organizing page content with card wrapper
 */
export const Section: React.FC<SectionProps> = ({
  title,
  description,
  actions,
  children,
  className = "",
  ...props
}) => {
  return (
    <section
      className={`bg-white dark:from-olive/30 dark:via-olive-dark/40 dark:to-olive/20
                  dark:bg-gradient-to-br
                  backdrop-blur-xl backdrop-saturate-150
                  border-2 border-olive/20 dark:border-white/10
                  rounded-lg p-6
                  shadow-depth-3-light dark:shadow-depth-2
                  hover:shadow-depth-4-light dark:hover:shadow-depth-3
                  transition-all duration-300 ease-in-out
                  mb-8
                  animate-fade-in
                  ${className}`}
      {...props}
    >
      {(title || description || actions) && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            {title && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-coffee via-caramel to-coffee rounded-full shadow-glow-coffee"></div>
                <h2 className="text-xl font-bold text-olive-dark dark:text-cream">{title}</h2>
              </div>
            )}
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
          {description && <p className="text-sm text-olive/80 dark:text-caramel/70 ml-6">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};
