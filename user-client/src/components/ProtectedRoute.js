import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  const isTokenExpired = () => {
    if (!token) return true; // Token is not present, so expired
    const tokenExpTime = JSON.parse(atob(token.split(".")[1])).exp * 1000;
    return Date.now() > tokenExpTime;
  };

  if (!isAuthenticated || isTokenExpired()) {
    // Redirect to login if not authenticated or token has expired
    return <Navigate to="/signin" />;
  }

  // If authenticated and token is not expired, render the child component
  return children;
};

export default ProtectedRoute;
