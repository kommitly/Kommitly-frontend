import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Runs once on app load
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/profile/",
        {
          method: "GET",
          credentials: "include", // ✅ THIS IS THE KEY
        }
      );

      if (!response.ok) {
        setUser(null);
        return false;
      }

      const userData = await response.json();
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Fetch user failed:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    // Login already set cookies
    const success = await fetchUser();
    if (success) {
      navigate("/dashboard/home");
    }
  };

  const logout = async () => {
    // optional: call backend logout endpoint to clear cookies
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
