import axios from "axios";
import apiClient from "./api";

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

export const authService = {
  register: async (userData) => {
    const { email, password, full_name, account_type, faculty, contact } = userData;

    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      full_name,
      account_type,
      faculty,
      contact
    });

    if (data?.data?.token) {
      localStorage.setItem("token", data.data.token);
    }
    if (data?.data?.user) {
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return { status: data.status, data: data.data, message: data.message };
  },

  login: async (email, password) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });

    if (data?.data?.token) {
      localStorage.setItem("token", data.data.token);
    }
    if (data?.data?.user) {
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return { status: data.status, data: data.data, message: data.message };
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    redirectToLogin();
  },

  verify: async () => {
    try {
      const response = await apiClient.get("/auth/verify");
      return response.data;
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      throw error;
    }
  },

  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem("token"),

  isAuthenticated: () => Boolean(localStorage.getItem("token"))
};

export default authService;
