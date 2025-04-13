import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setTokenExpired } from "../redux/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const isTokenExpired = () => {
    if (!token) return true; // Token is not present, so expired
    try {
      const tokenExpTime = JSON.parse(atob(token.split(".")[1])).exp * 1000;
      return Date.now() > tokenExpTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  };

  useEffect(() => {
    // Check if token is expired on component mount and on token change
    if (token && isTokenExpired()) {
      dispatch(setTokenExpired());
    }
  }, [token, dispatch]);

  if (!isAuthenticated || isTokenExpired()) {
    // Store the current location in sessionStorage before redirecting
    sessionStorage.setItem("lastVisitedUrl", location.pathname);
    
    // Redirect to login if not authenticated or token has expired
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated and token is not expired, render the child component
  return children;
};

export default ProtectedRoute;
