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

  const getUserRole = () => {
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).role;
  };

  if (!isAuthenticated || isTokenExpired()) {
    return <Navigate to="/signin" />;
  }

  if (getUserRole() !== "admin") {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
