import axios from "axios";

// Determine the base URL from environment variables
const baseURL = process.env.NODE_ENV === "development" 
  ? process.env.REACT_APP_DEV_API_URL 
  : process.env.REACT_APP_PROD_API_URL;

console.log("API Base URL:", baseURL); // Add logging to help debugging

// Create axios instance with default configuration
export const baseurl = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000 // 15 seconds timeout
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
    // Enhanced error logging
    console.error('API Error:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);