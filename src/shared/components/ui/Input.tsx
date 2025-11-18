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
      "px-4 py-2 " +
      "bg-olive-dark/50 dark:bg-olive-dark/50 " +
      "backdrop-blur-sm " +
      "border rounded-md " +
      "text-cream dark:text-cream " +
      "placeholder-caramel/50 dark:placeholder-caramel/50 " +
      "shadow-depth-1 dark:shadow-depth-1 " +
      "focus:shadow-depth-2 dark:focus:shadow-depth-2 " +
      "focus:ring-2 focus:ring-coffee/50 focus:ring-offset-2 " +
      "focus:ring-offset-olive-dark dark:focus:ring-offset-olive-dark " +
      "transition-all duration-200 ease-in-out " +
      "hover:bg-olive-dark/60 dark:hover:bg-olive-dark/60";

    const borderStyle = error
      ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500"
      : "border-coffee/40 dark:border-coffee/40 focus:border-coffee dark:focus:border-coffee";

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-caramel dark:text-caramel mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${borderStyle} ${widthStyle} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-caramel/70 dark:text-caramel/70">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
