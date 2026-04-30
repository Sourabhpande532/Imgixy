import axios, { AxiosHeaders } from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// eslint-disable-next-line react-refresh/only-export-components
export const setAuthToken = (
  token: string | number | boolean | AxiosHeaders | string[] | null | undefined,
) => {
  API.defaults.headers.common["Authorization"] = token;
};

export default API;
