import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { setToken } from "./services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));

const PageLoader = () => (
  <div className="kx-spinner-wrap" style={{ minHeight: "80vh" }}>
    <div className="kx-spinner" />
  </div>
);

const NotFound = () => {
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("kavioToken"));

  return (
    <div className="kx-login-page">
      <div className="kx-login-card text-center">
        <div className="kx-login-logo-badge" aria-hidden="true">
          <i className="fas fa-compass" />
        </div>
        <h1 className="kx-login-title">Page Not Found</h1>
        <p className="kx-login-subtitle">
          The page you are looking for does not exist or may have been moved.
        </p>
        <button
          type="button"
          className="kx-google-btn"
          onClick={() => navigate(hasToken ? "/dashboard" : "/")}
        >
          <i className="fas fa-arrow-left" />
          <span>{hasToken ? "Back to Workspace" : "Back to Home"}</span>
        </button>
      </div>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return localStorage.getItem("imgixy_theme") === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (token) {
      setToken(token);
    }

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<"dark" | "light">;
      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setTheme(customEvent.detail);
      }
    };

    window.addEventListener("imgixy-theme-change", handleThemeChange);
    return () =>
      window.removeEventListener("imgixy-theme-change", handleThemeChange);
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" theme={theme} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
