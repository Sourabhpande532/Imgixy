import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AlbumPage from "./pages/AlbumPage";
import { setToken } from "./services/api";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (token) {
      setToken(token);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/album/:id' element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
