import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AuthProtectedRoute from "./../guards/authGuard";
import Game from "../pages/Game";
import { Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Logout from "../pages/Logout";

function AppRoutes() {
  const loginRoute = (
    <Route
      path="login"
      element={
        <AuthProtectedRoute onlyPublic={true}>
          <Login />
        </AuthProtectedRoute>
      }
    />
  );

  const signupRoute = (
    <Route
      path="signup"
      element={
        <AuthProtectedRoute onlyPublic={true}>
          <Signup />
        </AuthProtectedRoute>
      }
    />
  );

  const logoutRoute = (
    <Route
      path="logout"
      element={
        <AuthProtectedRoute onlyPublic={false}>
          <Logout />
        </AuthProtectedRoute>
      }
    />
  );

  const startedGameRoute = (
    <Route
      path=":id"
      element={
        <AuthProtectedRoute onlyPublic={false}>
          <Game />
        </AuthProtectedRoute>
      }
    />
  );

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomeLayout />}>
          {loginRoute}
          {signupRoute}
          {logoutRoute}
        </Route>
        <Route
          path="/game"
          element={
            <AuthProtectedRoute onlyPublic={false}>
              <Game />
            </AuthProtectedRoute>
          }
        >
          {startedGameRoute}
        </Route>
        <Route
          path="/game/:id"
          element={
            <AuthProtectedRoute onlyPublic={false}>
              <Game />
            </AuthProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

function HomeLayout() {
  return (
    <>
      <Home />
      <Outlet />
    </>
  );
}

export default AppRoutes;
