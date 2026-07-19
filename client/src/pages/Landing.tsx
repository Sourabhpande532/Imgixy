import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/api";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("kavioToken", token);
      setToken(token);
      navigate("/dashboard");
    } else {
      const existingToken = localStorage.getItem("kavioToken");
      if (existingToken) {
        setToken(existingToken);
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="animated-logo">📸</div>
        <h1 className="landing-title">Welcome to Imgixy</h1>
        <p className="landing-subtitle">
          Your ultimate digital vault to store, organize, and relive all your precious memories in one secure place.
        </p>

        <button
          className="get-started-btn"
          onClick={() => navigate("/login")}
        >
          Get Started
          <i className="fas fa-arrow-right ms-2" />
        </button>

        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">📁</span>
            <h3>Smart Albums</h3>
            <p>Organize photos intelligently with tags and folders.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <h3>AI Planner</h3>
            <p>Generate bespoke creative visions and aesthetic themes.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">☁️</span>
            <h3>Cloud Sync</h3>
            <p>Access your memories from any device, anywhere.</p>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
    </div>
  );
};

export default Landing;
