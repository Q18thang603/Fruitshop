import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Also set global axios defaults as a fallback
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("AXIOS_INTERCEPTOR: 401 Unauthorized detected. Clearing session.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only reload if we're not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;