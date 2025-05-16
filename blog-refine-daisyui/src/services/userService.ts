const API_URL = "http://localhost:4000/api/users";

export const UserService = {
  signup: async (user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
  }) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("Signup failed");
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Forgot password request failed");
    return response.json();
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) throw new Error("Reset password failed");
    return response.json();
  },

  me: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_URL}/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },
};