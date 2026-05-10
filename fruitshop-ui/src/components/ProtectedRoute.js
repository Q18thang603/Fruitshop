import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("PROTECTED_ROUTE: Checking access", { 
    path: window.location.pathname, 
    loading, 
    userPresent: !!user, 
    userRole: user?.role,
    requireAdmin 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Đang xác thực...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    console.warn("PROTECTED_ROUTE: No user found. Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "ROLE_ADMIN") {
    console.error("PROTECTED_ROUTE: Admin required but user has role:", user.role);
    return <Navigate to="/" replace />;
  }

  console.log("PROTECTED_ROUTE: Access granted");
  return children;
};

export default ProtectedRoute;
