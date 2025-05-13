import axios from "axios";

// Determine the base URL from environment variables
const baseURL = process.env.NODE_ENV === "development" 
  ? process.env.REACT_APP_DEV_API_URL 
  : process.env.REACT_APP_PROD_API_URL;

console.log("API Base URL:", baseURL); 

// Create axios instance with default configuration
export const baseurl = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000 
});

// Add response interceptor for error handling
baseurl.interceptors.response.use(
  response => {
    // If response looks like HTML instead of JSON, reject it
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('Received HTML response instead of JSON:', response.config.url);
      return Promise.reject(new Error('Received HTML instead of JSON. API endpoint might be incorrect.'));
    }
    return response;
  },
  error => {
    // Check for authentication errors (401 or requiresAuth flag)
    if (error.response && 
        (error.response.status === 401 || 
        (error.response.data && error.response.data.requiresAuth))) {
      
      console.error('Authentication error:', error.response?.data?.message || 'Authentication required');
      
      // Clear the token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Don't redirect if already on the login page to avoid redirect loops
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signin') &&
            !window.location.pathname.includes('/verify-account')) {
          // Add a small delay to ensure error handling completes
          setTimeout(() => {
            // Store the current location for redirection after login
            sessionStorage.setItem("lastVisitedUrl", window.location.pathname);
            window.location.href = '/signin';
          }, 100);
        }
      }
    }
    
    // Enhanced error logging
    console.error('API Error:', error.response?.data?.message || error.message, error.config?.url);
    return Promise.reject(error);
  }
);