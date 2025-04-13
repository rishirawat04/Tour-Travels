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
    const role = tokenData.role;
    
    if (Date.now() > expirationTime || role !== 'admin') {
      // Token is expired or not an admin, dispatch action to update state
      store.dispatch(setTokenExpired());
    }
  } catch (error) {
    console.error("Error checking authentication status:", error);
    // If there's an error parsing the token, consider it invalid
    store.dispatch(setTokenExpired());
  }
}; 