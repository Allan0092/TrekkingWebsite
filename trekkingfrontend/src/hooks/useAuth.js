import { useEffect, useState } from "react";

export const useAuth = () => {
  //   const User = {
  //     id: String,
  //     name: String,
  //     email: String,
  //     avatar,
  //     isAdmin,
  //   };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    // Mock login
    setUser({
      id: "1",
      name: "John Doe",
      email,
      isAdmin: false,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name, email, password) => {
    // Mock register
    setUser({
      id: "1",
      name,
      email,
      isAdmin: false,
    });
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
  };
};
