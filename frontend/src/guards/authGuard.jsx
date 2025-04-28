import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

const AuthProtectedRoute = ({ children, onlyPublic }) => {
  if (onlyPublic && isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (!onlyPublic && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthProtectedRoute;
