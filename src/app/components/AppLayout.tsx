import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import VersionSelector from "./VersionSelector";
import { ThemeToggle } from "../../shared/components/ui/ThemeToggle";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath === path + "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-dark via-background-tertiary to-olive-dark dark:from-olive-dark dark:via-background-tertiary dark:to-olive-dark">
      <div
        className="min-h-screen"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-cream dark:text-cream mb-1 flex items-center gap-3">
                      ☕ Coffee Brew
                    </h1>
                    <p className="text-caramel/80 dark:text-caramel/80">Your digital barista</p>
                  </div>
                  <div className="md:hidden">
                    <VersionSelector />
                  </div>
                </div>
                {/* Desktop Navigation - Hidden on mobile */}
                <nav className="hidden md:flex gap-3 items-center">
                  <Link
                    to="/"
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2
                                shadow-depth-1 dark:shadow-depth-1 hover:shadow-depth-2 dark:hover:shadow-depth-2 ${
                      isActive("/")
                        ? "bg-gradient-to-r from-coffee to-coffee/90 dark:from-coffee dark:to-coffee/90 text-cream dark:text-cream"
                        : "bg-olive/20 dark:bg-olive/20 text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/30 dark:hover:bg-olive/30 backdrop-blur-sm"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/methods"
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2
                                shadow-depth-1 dark:shadow-depth-1 hover:shadow-depth-2 dark:hover:shadow-depth-2 ${
                      isActive("/methods")
                        ? "bg-gradient-to-r from-coffee to-coffee/90 dark:from-coffee dark:to-coffee/90 text-cream dark:text-cream"
                        : "bg-olive/20 dark:bg-olive/20 text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/30 dark:hover:bg-olive/30 backdrop-blur-sm"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Methods
                  </Link>
                  <Link
                    to="/coffee"
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2
                                shadow-depth-1 dark:shadow-depth-1 hover:shadow-depth-2 dark:hover:shadow-depth-2 ${
                      isActive("/coffee")
                        ? "bg-gradient-to-r from-coffee to-coffee/90 dark:from-coffee dark:to-coffee/90 text-cream dark:text-cream"
                        : "bg-olive/20 dark:bg-olive/20 text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/30 dark:hover:bg-olive/30 backdrop-blur-sm"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <ellipse cx="12" cy="12" rx="5" ry="7" strokeWidth="2" />
                      <path d="M9 9.5 Q12 12 15 14.5" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Coffee
                  </Link>
                  <Link
                    to="/history"
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2
                                shadow-depth-1 dark:shadow-depth-1 hover:shadow-depth-2 dark:hover:shadow-depth-2 ${
                      isActive("/history")
                        ? "bg-gradient-to-r from-coffee to-coffee/90 dark:from-coffee dark:to-coffee/90 text-cream dark:text-cream"
                        : "bg-olive/20 dark:bg-olive/20 text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/30 dark:hover:bg-olive/30 backdrop-blur-sm"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    History
                  </Link>
                  <ThemeToggle />
                  <VersionSelector />
                </nav>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-12 pt-6 pb-20 md:pb-0 border-t border-olive/20 dark:border-olive/20">
            <div className="flex flex-col justify-center items-center gap-2 text-caramel/60 dark:text-caramel/60">
              <div className="flex justify-center items-center gap-2">
                <span className="text-sm">Built with ☕</span>
                <span className="text-caramel/40 dark:text-caramel/40">•</span>
                <a
                  href="https://github.com/stromland/coffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-cream dark:hover:text-cream transition-colors duration-200"
                  aria-label="View source on GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>View on GitHub</span>
                </a>
              </div>
              <span className="text-xs text-caramel/50 dark:text-caramel/50">
                Built:{" "}
                {new Date(
                  typeof __BUILD_TIME__ !== "undefined" ? __BUILD_TIME__ : new Date().toISOString()
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Visible only on mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0
                   bg-olive-dark/95 dark:bg-olive-dark/95
                   backdrop-blur-xl backdrop-saturate-150
                   border-t border-olive/30 dark:border-olive/30
                   shadow-depth-3 dark:shadow-depth-3
                   z-50"
        style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-around items-center px-2 py-2">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg
                        transition-all duration-200 min-w-[60px] min-h-[60px]
                        ${
              isActive("/")
                ? "bg-coffee/30 dark:bg-coffee/30 text-cream dark:text-cream shadow-depth-1 dark:shadow-depth-1"
                : "text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/20 dark:hover:bg-olive/20"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            to="/methods"
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg
                        transition-all duration-200 min-w-[60px] min-h-[60px]
                        ${
              isActive("/methods")
                ? "bg-coffee/30 dark:bg-coffee/30 text-cream dark:text-cream shadow-depth-1 dark:shadow-depth-1"
                : "text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/20 dark:hover:bg-olive/20"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-xs font-medium">Methods</span>
          </Link>
          <Link
            to="/coffee"
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg
                        transition-all duration-200 min-w-[60px] min-h-[60px]
                        ${
              isActive("/coffee")
                ? "bg-coffee/30 dark:bg-coffee/30 text-cream dark:text-cream shadow-depth-1 dark:shadow-depth-1"
                : "text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/20 dark:hover:bg-olive/20"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <ellipse cx="12" cy="12" rx="5" ry="7" strokeWidth="2" />
              <path d="M9 9.5 Q12 12 15 14.5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-medium">Coffee</span>
          </Link>
          <Link
            to="/history"
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg
                        transition-all duration-200 min-w-[60px] min-h-[60px]
                        ${
              isActive("/history")
                ? "bg-coffee/30 dark:bg-coffee/30 text-cream dark:text-cream shadow-depth-1 dark:shadow-depth-1"
                : "text-caramel dark:text-caramel hover:text-cream dark:hover:text-cream hover:bg-olive/20 dark:hover:bg-olive/20"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-medium">History</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
