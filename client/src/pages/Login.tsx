function Login() {
  const handleLogin = () => {
    window.open("http://localhost:5001/auth/google", "_self");
  };

  return (
    <div className="container text-center mt-5">
      <h2>KaviosPix</h2>
      <button className="btn btn-danger" onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;