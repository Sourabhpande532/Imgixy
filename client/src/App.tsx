import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AlbumPage from "./pages/AlbumPage";

function App() {
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
