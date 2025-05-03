import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./../pages/Home";
import Login from "./../pages/Login";
import Signup from "./../pages/Signup";
import AuthProtectedRoute from "./../guards/authGuard";
import Game from "./../pages/Game";

function AppRoutes() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={
              <AuthProtectedRoute onlyPublic={true}>
                <Signup />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthProtectedRoute onlyPublic={true}>
                <Login />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <AuthProtectedRoute onlyPublic={false}>
                <Game />
              </AuthProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default AppRoutes;
