import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/api";

function redirectToLogin() {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "./") {
    window.location.assign("./login");
    return;
  }
  window.location.assign(`${String(base).replace(/\/?$/, "")}/login`);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
