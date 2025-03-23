import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (isAuthenticated && role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default RedirectIfLoggedIn;
