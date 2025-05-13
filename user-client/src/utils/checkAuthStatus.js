import { setTokenExpired } from "../redux/slices/authSlice";

/**
 * Checks if the user's authentication token is valid and not expired
 * @param {object} store - Redux store
 */
export const checkAuthStatus = (store) => {
  const { token } = store.getState().auth;
  
  if (!token) return;
  
  try {
    // Check if token is expired
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    
    if (Date.now() > expirationTime) {
      // Token is expired, dispatch action to update state
      store.dispatch(setTokenExpired());
      
      // Clean up localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Handle cookie clearing (if possible to do client-side)
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  } catch (error) {
    console.error("Error checking authentication status:", error);
    // If there's an error parsing the token, consider it invalid
    store.dispatch(setTokenExpired());
    
    // Clean up localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Handle cookie clearing (if possible to do client-side)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}; 