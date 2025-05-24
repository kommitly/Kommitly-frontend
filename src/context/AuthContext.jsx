import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchUser(storedToken);
    } else {
      setLoading(false); // No token, set loading to false
    }
  }, []);

  const fetchUser = async (token) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch("https://kommitly-backend.onrender.com/api/users/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      if (response.ok) {
        setUser(userData);
        
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchUser(token);
    navigate("/dashboard/home"); // ✅ Navigate after user is set
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};