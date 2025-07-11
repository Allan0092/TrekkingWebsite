import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store token and user data
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));

        // Set user state with complete data
        setUser(data.user);

        return { success: true, data };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Clear user state
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
