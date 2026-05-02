import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("kavioToken");
    navigate("/");
  };
  return (
    <nav className='navbar navbar-dark bg-dark px-3'>
      <div className="container">
        <Link to='/dashboard' className='navbar-brand'>
          KaviosPix
        </Link>

        <button className='btn btn-danger' onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
