import React from "react";

let inputIdCounter = 0;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text or element */
  label?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Full width input */
  fullWidth?: boolean;
}

/**
 * Reusable Input component with consistent styling
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className = "", id, ...props }, ref) => {
    const inputId = React.useMemo(() => id || `input-${++inputIdCounter}`, [id]);

    const baseStyles =
      "px-4 py-2 bg-olive-dark/50 border rounded-md text-cream placeholder-caramel/50 focus:ring-2 focus:ring-coffee transition-colors";

    const borderStyle = error
      ? "border-red-500 focus:border-red-500"
      : "border-coffee/40 focus:border-coffee";

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-caramel mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${borderStyle} ${widthStyle} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-caramel/70">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
