import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, setToken } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("imgixy_theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("imgixy_theme", theme);
    window.dispatchEvent(new CustomEvent("imgixy-theme-change", { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    localStorage.removeItem("kavioToken");
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="kx-navbar" aria-label="Main Navigation">
      <div className="container d-flex align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-3">
          <Link to="/dashboard" className="navbar-brand mb-0">
            <i className="fas fa-camera-retro" style={{ color: "var(--accent)" }} />
            <span>Imgixy</span>
            <span className="kx-brand-dot" />
          </Link>

          {location.pathname.startsWith("/album/") && (
            <Link
              to="/dashboard"
              className="d-none d-md-inline-flex align-items-center gap-1"
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              <i className="fas fa-chevron-left" style={{ fontSize: "0.7rem" }} />
              <span>Workspace</span>
            </Link>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {user?.email && (
            <div className="kx-user-pill" title={`Signed in as ${user.email}`}>
              <i className="fas fa-circle-user" style={{ color: "var(--accent)" }} />
              <span>{user.email}</span>
            </div>
          )}

          <button
            type="button"
            id="theme-toggle-btn"
            className="kx-theme-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
          </button>

          <button
            type="button"
            id="navbar-logout-btn"
            className="kx-logout-btn"
            onClick={logout}
            aria-label="Logout of Imgixy"
          >
            <i className="fas fa-sign-out-alt" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
