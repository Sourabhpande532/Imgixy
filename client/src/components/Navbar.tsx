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
          <i className="fas fa-camera-retro me-2" style={{ color: "#a855f7" }} />
          Imgixy
        </Link>

        <button id="navbar-logout-btn" className="kx-logout-btn" onClick={logout}>
          <i className="fas fa-sign-out-alt me-1" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
