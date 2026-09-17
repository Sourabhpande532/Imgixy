import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { setToken } from "./services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));

const PageLoader = () => (
  <div className="kx-spinner-wrap" style={{ minHeight: "80vh" }}>
    <div className="kx-spinner" />
  </div>
);

function App() {
  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (token) {
      setToken(token);
    }
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" theme="dark" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/album/:albumId' element={<AlbumPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


export default App;
