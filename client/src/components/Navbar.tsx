import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("kavioToken");
    navigate("/");
  };

  return (
    <nav className="kx-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className="navbar-brand mb-0">
          <i className="fas fa-camera-retro me-2" style={{ color: "var(--accent)" }} />
          <span>Imgixy</span>
          <span className="kx-brand-dot ms-1" />
        </Link>

        <button
          id="navbar-logout-btn"
          className="kx-logout-btn"
          onClick={logout}
          aria-label="Logout of Imgixy"
        >
          <i className="fas fa-sign-out-alt" />
          <span>Logout</span>
        </button>
      </div>
    </nav>

  );
};

export default Navbar;
