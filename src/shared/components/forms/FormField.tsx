import React from "react";

export interface FormFieldProps {
  /** Label text */
  label: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Required field indicator */
  required?: boolean;
  /** Field content */
  children: React.ReactNode;
  /** Field ID for label association */
  htmlFor?: string;
}

/**
 * FormField wrapper component for consistent form field layout
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  htmlFor,
}) => {
  return (
    <div className="mb-6">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-caramel mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-caramel/70">{helperText}</p>}
    </div>
  );
};
