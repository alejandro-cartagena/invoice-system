import { useState, useEffect } from "react";
import { loginUser, fetchUserData, logoutUser } from "../services/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    const storedIsAdmin = localStorage.getItem("isAdmin");
    return storedIsAdmin === "true";
  });

  console.log("User: ", user);

  // Check if token exists and fetch user data
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Set initial states from localStorage immediately
      setToken(storedToken);
      setIsAdmin(storedIsAdmin);
      
      try {
        const userData = await fetchUserData(storedToken);
        setUser(userData);
        // Only update isAdmin if it's different
        if (userData.is_super_admin !== storedIsAdmin) {
          setIsAdmin(userData.is_super_admin);
          localStorage.setItem("isAdmin", userData.is_super_admin);
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Only run on mount

  // Login function
  const login = async (username, password) => {
    try {
      const data = await loginUser(username, password);
      const newToken = data.token;
      
      localStorage.setItem("token", newToken);
      
      const userData = await fetchUserData(newToken);
      
      // Store isAdmin in localStorage
      localStorage.setItem("isAdmin", userData.is_super_admin);
      
      setToken(newToken);
      setUser(userData);
      setIsAdmin(userData.is_super_admin);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin"); // Clear isAdmin from localStorage
    setUser(null);
    setToken(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

