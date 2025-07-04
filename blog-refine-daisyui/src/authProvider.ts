// src/providers/authProvider.ts
import { AuthBindings } from "@refinedev/core";
import axios from "axios";

export const authProvider: AuthBindings = {
login: async ({ email, password }) => {
  try {
    const response = await axios.post("http://localhost:4000/api/users/signin", {
      email,
      password,
    });

    const token = response.data.data.token; // ✅ caminho correto
    /* console.log("Token received:", token); */

    localStorage.setItem("token", token);
    return { success: true, redirectTo: "/dashboard" };
  } catch (error) {
    return { success: false, error: { name: "LoginError", message: "Login failed" } };
  }
},
  

  logout: async () => {
    localStorage.removeItem("token");
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = localStorage.getItem("token");
    if (token) return { authenticated: true };
    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
    const token = localStorage.getItem("token");
    /* console.log("Token for getIdentity:", token); */
    if (!token) return null;
    try {
      const response = await axios.get("http://localhost:4000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...response.data };
    } catch {
      return null;
    }

  },

  getPermissions: async () => null,

  onError: async (error) => {
    // Optionally handle global auth errors here
    return { error };
  },
};
