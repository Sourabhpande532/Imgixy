import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001",
});

// eslint-disable-next-line react-refresh/only-export-components
export const setToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = token;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
