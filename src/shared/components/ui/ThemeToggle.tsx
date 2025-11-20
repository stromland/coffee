import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg
                 bg-olive/20 dark:bg-olive/20 hover:bg-olive/30 dark:hover:bg-olive/30
                 border border-coffee/20 dark:border-coffee/30
                 shadow-depth-1 dark:shadow-depth-1 hover:shadow-depth-2 dark:hover:shadow-depth-2
                 transition-all duration-200 hover:scale-105 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-coffee/50 focus:ring-offset-2
                 focus:ring-offset-olive-dark dark:focus:ring-offset-olive-dark
                 group"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon (shown in dark mode) */}
      <svg
        className={`absolute w-5 h-5 text-caramel transition-all duration-300 ${
          resolvedTheme === 'dark'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon (shown in light mode) */}
      <svg
        className={`absolute w-5 h-5 text-olive transition-all duration-300 ${
          resolvedTheme === 'light'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-glow-coffee" />
    </button>
  );
}
