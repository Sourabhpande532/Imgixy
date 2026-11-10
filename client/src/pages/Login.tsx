import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { setToken } from "../services/api";

function Login() {
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
    const token = new URLSearchParams(window.location.search).get("token");
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

  const handleGoogleLogin = () => {
    const baseUrl = API.defaults.baseURL || "https://imgixy.vercel.app";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    window.open(`${cleanBaseUrl}/auth/google`, "_self");
  };

  return (
    <div className="kx-login-page">
      <div
        className="d-flex align-items-center justify-content-between w-100"
        style={{ maxWidth: 440, marginBottom: "1rem" }}
      >
        <Link
          to="/"
          className="d-inline-flex align-items-center gap-2"
          style={{ color: "var(--text-muted)", fontSize: "0.84rem", fontWeight: 600 }}
        >
          <i className="fas fa-arrow-left" />
          <span>Back to Home</span>
        </Link>

        <button
          type="button"
          className="kx-theme-btn"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
        </button>
      </div>

      <div className="kx-login-card text-center">
        <div className="kx-login-logo-badge" aria-hidden="true">
          <i className="fas fa-camera-retro" />
        </div>

        <h1 className="kx-login-title">Imgixy</h1>
        <p className="kx-login-subtitle">
          Your personal cloud vault to store, curate, and share every photo collection securely.
        </p>

        {/* Feature pills */}
        <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
          {[
            { icon: "fa-folder-open", text: "Smart Albums" },
            { icon: "fa-cloud-arrow-up", text: "Cloud Vault" },
            { icon: "fa-star", text: "Curated Favorites" },
          ].map(({ icon, text }) => (
            <span key={text} className="kx-feature-pill">
              <i className={`fas ${icon}`} />
              <span>{text}</span>
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "0 0 1.4rem",
            color: "var(--text-muted)",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--glass-border)" }} />
          <span>Sign in with Google OAuth 2.0</span>
          <div style={{ flex: 1, height: 1, background: "var(--glass-border)" }} />
        </div>

        <button
          type="button"
          id="google-login-btn"
          className="kx-google-btn"
          onClick={handleGoogleLogin}
          aria-label="Continue with Google Authentication"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Trust signals */}
        <div
          style={{
            marginTop: "1.65rem",
            display: "flex",
            justifyContent: "center",
            gap: "1.15rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "fa-lock", label: "JWT Protected" },
            { icon: "fa-cloud", label: "Cloudinary CDN" },
            { icon: "fa-tags", label: "Tag & Filter" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.76rem",
                color: "var(--text-muted)",
              }}
            >
              <i className={`fas ${icon}`} style={{ color: "var(--accent)", fontSize: "0.7rem" }} />
              <span>{label}</span>
            </span>
          ))}
        </div>

        <p style={{ marginTop: "1.2rem", fontSize: "0.74rem", color: "var(--text-muted)" }}>
          Authenticated securely via Google Identity Services
        </p>
      </div>
    </div>
  );
}

export default Login;
