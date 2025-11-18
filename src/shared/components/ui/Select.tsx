import React from "react";

let selectIdCounter = 0;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Full width select */
  fullWidth?: boolean;
  /** Options for the select */
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
}

/**
 * Reusable Select component with consistent styling
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, fullWidth = false, options, className = "", id, ...props }, ref) => {
    const selectId = React.useMemo(() => id || `select-${++selectIdCounter}`, [id]);

    const baseStyles =
      "px-4 py-2 " +
      "bg-white/80 dark:bg-olive-dark/50 " +
      "backdrop-blur-sm " +
      "border rounded-md " +
      "text-olive-dark dark:text-cream " +
      "shadow-depth-1-light dark:shadow-depth-1 " +
      "focus:shadow-depth-2-light dark:focus:shadow-depth-2 " +
      "focus:ring-2 focus:ring-coffee/50 focus:ring-offset-2 " +
      "focus:ring-offset-cream-light dark:focus:ring-offset-olive-dark " +
      "transition-all duration-200 ease-in-out " +
      "hover:bg-white dark:hover:bg-olive-dark/60 " +
      "cursor-pointer";

    const borderStyle = error
      ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500"
      : "border-coffee/40 dark:border-coffee/40 focus:border-coffee dark:focus:border-coffee";

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-olive dark:text-caramel mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${baseStyles} ${borderStyle} ${widthStyle} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-olive/70 dark:text-caramel/70">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
