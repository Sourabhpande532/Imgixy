import axios from "axios";

// Backend API URL — separate from the frontend Vercel deployment
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://imgixy.vercel.app",
  withCredentials: true,
});

// eslint-disable-next-line react-refresh/only-export-components
export const setToken = (token: string | null) => {
  if (token) {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    API.defaults.headers.common["Authorization"] = bearer;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
