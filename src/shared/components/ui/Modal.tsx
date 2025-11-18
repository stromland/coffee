import React, { useEffect, useRef } from "react";

let modalIdCounter = 0;

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Footer content (typically buttons) */
  footer?: React.ReactNode;
  /** Size of the modal */
  size?: "sm" | "md" | "lg" | "xl";
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
}

/**
 * Reusable Modal component for dialogs and overlays
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = React.useMemo(() => `modal-title-${++modalIdCounter}`, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/70 dark:bg-black/80
                 backdrop-blur-md
                 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        ref={modalRef}
        className={`bg-gradient-to-br from-olive/95 via-olive-dark/90 to-olive/95
                    dark:from-olive/95 dark:via-olive-dark/90 dark:to-olive/95
                    backdrop-blur-xl backdrop-saturate-150
                    border border-white/10 dark:border-white/10
                    rounded-lg
                    shadow-depth-4 dark:shadow-depth-4
                    w-full ${sizeStyles[size]}
                    max-h-[90vh]
                    overflow-hidden
                    flex flex-col
                    animate-scale-in`}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-coffee/20 dark:border-coffee/20">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-coffee via-caramel to-coffee rounded-full shadow-glow-coffee"></div>
              <h2 id={titleId} className="text-2xl font-bold text-cream dark:text-cream">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-caramel dark:text-caramel
                         hover:text-cream dark:hover:text-cream
                         hover:bg-olive/20 dark:hover:bg-olive/20
                         rounded-md p-1
                         transition-all duration-200
                         hover:scale-110 active:scale-95"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6 text-cream dark:text-cream">{children}</div>
        {footer && (
          <div className="p-6 border-t border-coffee/20 dark:border-coffee/20
                          bg-olive-dark/30 dark:bg-olive-dark/30
                          backdrop-blur-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
