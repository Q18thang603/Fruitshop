import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      console.log("AUTH_CONTEXT: Verifying user session. Token present:", !!token);
      console.log("TOKEN:", token);
      
      if (token) {
        // Set default header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        try {
          const response = await api.get("/auth/me");
          console.log("AUTH_CONTEXT: /auth/me response", response.data);
          
          if (response.data.success) {
            const userData = {
              username: response.data.data.username,
              role: response.data.data.role
            };
            console.log("AUTH_CONTEXT: Session restored", userData);
            setUser(userData);
          } else {
            console.warn("AUTH_CONTEXT: Session invalid according to backend");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
          }
        } catch (error) {
          console.error("AUTH_CONTEXT: Session verification error", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (username, password) => {
    try {
      console.log("AUTH_CONTEXT: Attempting login for", username);
      const response = await api.post("/auth/login", { username, password });
      console.log("AUTH_CONTEXT: Login API response", response.data);
      
      if (response.data.success) {
        const { token, role, username: returnedUsername } = response.data.data;
        console.log("AUTH_CONTEXT: TOKEN extracted from response:", token);
        
        // Persist token immediately
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        const loggedUser = { 
          username: returnedUsername || username, 
          role: role || "ROLE_USER" 
        };
        
        localStorage.setItem("user", JSON.stringify(loggedUser));
        console.log("AUTH_CONTEXT: User persisted to localStorage", loggedUser);
        
        setUser(loggedUser);
        console.log("AUTH_CONTEXT: State updated with user", loggedUser);
        
        return response.data;
      } else {
        console.warn("AUTH_CONTEXT: Login failed according to API", response.data.message);
        return response.data;
      }
    } catch (error) {
      console.error("AUTH_CONTEXT: Login error caught", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const register = async (username, email, password, phone) => {
    try {
      const response = await api.post("/auth/register", { username, email, password, phone });
      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = React.useMemo(() => ({
    user, loading, login, register, logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
