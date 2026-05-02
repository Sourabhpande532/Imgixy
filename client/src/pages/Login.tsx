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
      console.log("Token Received:", token);
      localStorage.setItem("kavioToken", token);
      setToken(token);
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className='container text-center mt-5'>
      <h2>KaviosPix</h2>
      <button
        className='btn btn-danger'
        onClick={() =>
          window.open("https://imgixy.vercel.app/auth/google", "_self")
        }>
        Login with Google
      </button>
    </div>
  );
}

export default Login;
