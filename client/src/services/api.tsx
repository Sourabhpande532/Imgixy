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

export interface AuthUser {
  id: string;
  email: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const getCurrentUser = (): AuthUser | null => {
  try {
    const rawToken = localStorage.getItem("kavioToken");
    if (!rawToken) return null;
    const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const parsed = JSON.parse(jsonPayload);
    if (parsed && (parsed.id || parsed._id)) {
      return {
        id: String(parsed.id || parsed._id),
        email: String(parsed.email || ""),
      };
    }
    return null;
  } catch {
    return null;
  }
};

// Automatically handle expired/invalid tokens (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("kavioToken");
      delete API.defaults.headers.common["Authorization"];
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
