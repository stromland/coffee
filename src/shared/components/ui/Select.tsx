import React from 'react';

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
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseStyles =
      'px-4 py-2 bg-olive-dark/50 border rounded-md text-cream focus:ring-2 focus:ring-coffee transition-colors cursor-pointer';
    
    const borderStyle = error
      ? 'border-red-500 focus:border-red-500'
      : 'border-coffee/40 focus:border-coffee';
    
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-caramel mb-2"
          >
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
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-caramel/70">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
