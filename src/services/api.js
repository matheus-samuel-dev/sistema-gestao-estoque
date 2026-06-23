import axios from "axios";

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

const apiUrl =
  rawApiUrl.startsWith("http://") ||
  rawApiUrl.startsWith("https://")
    ? rawApiUrl
    : `https://${rawApiUrl}`;

const api = axios.create({
  baseURL: apiUrl,
  timeout: 20000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith("/login")) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;
