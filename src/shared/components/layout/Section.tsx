import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Header actions */
  actions?: React.ReactNode;
  /** Section content */
  children: React.ReactNode;
  /** Background style */
  variant?: 'default' | 'card';
}

/**
 * Section component for organizing page content
 */
export const Section: React.FC<SectionProps> = ({
  title,
  description,
  actions,
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: '',
    card: 'bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl',
  };

  return (
    <section className={`mb-8 ${variantStyles[variant]} ${className}`} {...props}>
      {(title || description || actions) && (
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            {title && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-coffee rounded-full"></div>
                <h2 className="text-2xl font-bold text-cream">{title}</h2>
              </div>
            )}
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
          {description && <p className="text-sm text-caramel/70 ml-6">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};
