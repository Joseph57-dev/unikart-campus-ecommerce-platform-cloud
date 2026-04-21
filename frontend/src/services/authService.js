import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import apiClient from "./api";

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const { username, password, email } = userData;
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: { email }
        }
      });
      return { status: "success", data: result };
    } catch (error) {
      console.error("Auth Error:", error);
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const user = await signIn({ username: email, password });
      // Get user info from backend
      const response = await apiClient.get("/auth/verify");
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      return { status: "success", data: { user: response.data.data.user } };
    } catch (error) {
      console.error("Auth Error:", error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut();
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Auth Error:", error);
    }
  },

  // Verify token
  verify: async () => {
    try {
      const response = await apiClient.get("/auth/verify");
      return response.data;
    } catch (error) {
      localStorage.removeItem("user");
      throw error;
    }
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString();
    } catch (error) {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: async () => {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
};

export default authService;
