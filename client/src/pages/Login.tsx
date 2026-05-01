/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/api";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    // Read token
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("kavioToken", token);
      setToken(token);
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = () => {
    window.open("http://localhost:5001/auth/google", "_self");
  };

  return (
    <div className='container text-center mt-5'>
      <h2>KaviosPix</h2>
      <button className='btn btn-danger' onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;
