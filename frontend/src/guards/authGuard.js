import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

const AuthProtectedRoute = ({ children }) => {
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default AuthProtectedRoute;
