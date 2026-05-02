/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/api";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("kavioToken", token);
      setToken(token);
      navigate("/dashboard");
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>📸</div>

        <h2 style={styles.title}>KaviosPix</h2>
        <p style={styles.subtitle}>Store, organize and relive your memories</p>

        <button
          style={styles.button}
          onClick={() =>
            window.open("https://imgixy.vercel.app/auth/google", "_self")
          }>
          <span style={{ marginRight: "10px" }}>🔐</span>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0e7ff, #f8fafc)",
  },
  card: {
    width: "90%",
    maxWidth: "380px",
    padding: "30px 25px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  logo: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  title: {
    fontWeight: "600",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "25px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.3s",
  },
};
