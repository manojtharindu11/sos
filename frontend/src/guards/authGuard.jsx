import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

const AuthProtectedRoute = ({ children, onlyPublic = false }) => {
  if (onlyPublic && isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthProtectedRoute;
