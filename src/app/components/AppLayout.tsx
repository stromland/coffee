import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

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
    <div className="min-h-screen bg-olive-dark">
      <div className="bg-gradient-to-br from-olive-dark via-olive-dark to-olive/20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-8">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-cream mb-1 flex items-center gap-3">
                    ☕ Coffee Brew Dashboard
                  </h1>
                  <p className="text-caramel/80">
                    Perfect your pour-over with precise measurements and timing
                  </p>
                </div>
                <nav className="flex gap-3">
                  <Link
                    to="/"
                    className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                      isActive("/")
                        ? "bg-coffee text-cream"
                        : "bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30"
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
                    className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                      isActive("/methods")
                        ? "bg-coffee text-cream"
                        : "bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30"
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
                    to="/history"
                    className={`px-4 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                      isActive("/history")
                        ? "bg-coffee text-cream"
                        : "bg-olive/20 text-caramel hover:text-cream hover:bg-olive/30"
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
                </nav>
              </div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
