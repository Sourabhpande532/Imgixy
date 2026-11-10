import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/api";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return localStorage.getItem("imgixy_theme") === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("imgixy_theme", theme);
    window.dispatchEvent(new CustomEvent("imgixy-theme-change", { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("kavioToken", token);
      setToken(token);
      navigate("/dashboard", { replace: true });
    } else {
      const existingToken = localStorage.getItem("kavioToken");
      if (existingToken) {
        setToken(existingToken);
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="landing-page-wrap">
      <header className="landing-header">
        <div className="container d-flex align-items-center justify-content-between">
          <div
            className="d-flex align-items-center gap-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "1.3rem",
              color: "var(--text-h)",
              letterSpacing: "-0.03em",
            }}
          >
            <i className="fas fa-camera-retro" style={{ color: "var(--accent)" }} />
            <span>Imgixy</span>
            <span className="kx-brand-dot" />
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="kx-theme-btn"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
            </button>
            <button
              type="button"
              className="kx-btn-primary"
              onClick={() => navigate("/login")}
              style={{ borderRadius: "99px", padding: "0.48rem 1.2rem", fontSize: "0.85rem" }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="landing-container">
        <div className="landing-content">
          <div className="landing-eyebrow">
            <i className="fas fa-sparkles" />
            <span>Cloud Photo Vault &amp; AI Creative Studio</span>
          </div>

          <h1 className="landing-title">
            Curate Your Digital <span>Memories</span>
          </h1>
          <p className="landing-subtitle">
            Your cloud photo vault to store, tag, filter, and share high-resolution photo collections with Google OAuth security and AI-assisted creative direction.
          </p>

          <div className="landing-cta-group">
            <button
              type="button"
              className="get-started-btn"
              onClick={() => navigate("/login")}
              aria-label="Get Started with Imgixy"
            >
              <span>Get Started</span>
              <i className="fas fa-arrow-right" />
            </button>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-badge" aria-hidden="true">
                <i className="fas fa-folder-tree" />
              </div>
              <h3>Smart Curation</h3>
              <p>Organize photos into albums with custom tags, person labels, favorites, and instant search filters.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-badge" aria-hidden="true">
                <i className="fas fa-wand-magic-sparkles" />
              </div>
              <h3>AI Creative Director</h3>
              <p>Stream tailored photoshoot concepts, lighting setups, and shot-by-shot composition plans in real time.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-badge" aria-hidden="true">
                <i className="fas fa-user-shield" />
              </div>
              <h3>Controlled Sharing</h3>
              <p>Share albums via email with read-only collaborator permissions while owners retain full control.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-badge" aria-hidden="true">
                <i className="fas fa-bolt" />
              </div>
              <h3>Cloudinary CDN</h3>
              <p>Stream uploads directly to the cloud with automatic WebP/AVIF format and quality optimization.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <span>Imgixy — Built with React, Express, MongoDB, Cloudinary &amp; Google OAuth 2.0</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
