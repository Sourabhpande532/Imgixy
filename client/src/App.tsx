import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setToken } from "./services/api";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AlbumPage from "./pages/AlbumPage";

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
  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/album/:albumId" element={<AlbumPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
