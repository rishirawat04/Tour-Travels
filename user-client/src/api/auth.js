import { baseurl } from "./baseURL";

export const login = async (email, password) => {
  try {
    const response = await baseurl.post("/user/signin", { email, password });
    return response.data; 
  } catch (error) {
    throw error; 
  }
};

export const logoutServer = async () => {
  try {
    const response = await baseurl.post("/user/logout");
    
    // Clean up localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Handle cookie clearing (if possible to do client-side)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    return response.data;
  } catch (error) {
    // Even if the server logout fails, try to clean up client-side
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    throw {
      ...error,
      message: error.response?.data?.message || "Logout failed. Please try again."
    };
  }
};

export const signup = async (formData) => {
  try {
    const response = await baseurl.post("/user/signup", formData);
   
    return response;
  } catch (error) {
    
    const errorMessage =
      error.response?.data?.msg || "Signup failed. Please try again.";
    throw new Error(errorMessage);
  }
};

// Function to verify OTP
export const verifyOTP = async (formData) => {
  try {
    // Make sure the data is formatted with email and code fields
    const data = {
      email: formData.email,
      code: formData.otp || formData.code // Handle both field names
    };
    const response = await baseurl.post("/user/verifyAccount", data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || "Verification failed. Please try again.";
  }
};

// Function to resend OTP
export const resendCode = async (formData) => {
  try {
    const response = await baseurl.post("/user/resendCode", formData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.msg || "Failed to resend OTP. Please try again."
    );
  }
};

// Forgot password request
export const forgotPassword = async (formData) => {
  try {
    const response = await baseurl.post("/user/forgot-password", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || "Failed to send OTP. Please try again.";
  }
};

// Resend OTP request
export const resendPasswordCode = async (formData) => {
  try {
    const response = await baseurl.post("/user/resendCode", formData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.msg || "Failed to resend OTP. Please try again."
    );
  }
};

// Verify OTP request
export const verifyPasswordOTP = async (formData) => {
  try {
    // Make sure the data is formatted with email and code fields
    const data = {
      email: formData.email,
      code: formData.code || formData.otp // Handle both field names
    };
    const response = await baseurl.post("/user/verify-otp", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.msg || "OTP verification failed. Please try again."
    );
  }
};

// Reset password request
export const resetPassword = async (formData) => {
  try {
    const response = await baseurl.post("/user/reset-password", formData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.msg || "Failed to reset password. Please try again."
    );
  }
};

// get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await baseurl.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    // Check if it's an authentication error (401)
    if (error.response && error.response.status === 401) {
      throw {
        ...error,
        isAuthError: true,
        message: error.response.data?.message || "Please login to view your profile"
      };
    }
    
    throw {
      ...error,
      message: error.response?.data?.message || "Failed to get profile. Please try again."
    };
  }
};

// update user profile
export const updateUserProfile = async (userId, formDataToSend) => {
  try {
    const response = await baseurl.put(`/user/${userId}`, formDataToSend, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // Check if it's an authentication error (401)
    if (error.response && error.response.status === 401) {
      throw {
        ...error,
        isAuthError: true,
        message: error.response.data?.message || "Please login to update your profile"
      };
    }
    
    throw {
      ...error,
      message: error.response?.data?.message || "Failed to update profile. Please try again."
    };
  }
};


// change user password
export const changeUserPassword = async (userId, data) => {
  try {
    const response = await baseurl.put(`/user/${userId}/password`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // Check if it's an authentication error (401)
    if (error.response && error.response.status === 401) {
      throw {
        ...error,
        isAuthError: true,
        message: error.response.data?.message || "Please login to change your password"
      };
    }
    
    throw {
      ...error,
      message: error.response?.data?.message || "Failed to update password. Please try again."
    };
  }
};

