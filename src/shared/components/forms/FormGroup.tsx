import React from 'react';

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title for the form group */
  title?: string;
  /** Description for the form group */
  description?: string;
  /** Form fields */
  children: React.ReactNode;
}

/**
 * FormGroup component for grouping related form fields
 */
export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  description,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-8 ${className}`} {...props}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-cream mb-1">{title}</h3>}
          {description && <p className="text-sm text-caramel/70">{description}</p>}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
};
