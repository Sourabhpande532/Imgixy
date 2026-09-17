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
        <div className="animated-logo" aria-hidden="true">📸</div>
        <h1 className="landing-title">
          Curate Your Digital <span>Memories</span>
        </h1>
        <p className="landing-subtitle">
          Your hand-crafted cloud vault to store, organize, and relive all your precious photo collections in one secure place.
        </p>

        <button
          className="get-started-btn"
          onClick={() => navigate("/login")}
          aria-label="Get Started with Imgixy"
        >
          <span>Get Started</span>
          <i className="fas fa-arrow-right ms-1" />
        </button>

        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Folder">📁</span>
            <h3>Smart Curation</h3>
            <p>Organize photos intelligently with tags, metadata, and custom collections.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Sparkles">✨</span>
            <h3>AI Director</h3>
            <p>Generate bespoke creative visions, lighting setups, and aesthetic guidelines.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Cloud">☁️</span>
            <h3>Secure Vault</h3>
            <p>Cloud-synchronized photo storage with email sharing and privacy controls.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
