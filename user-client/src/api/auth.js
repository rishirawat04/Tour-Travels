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
  const response = await baseurl.post("/user/logout");
  return response.data;
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
    const response = await baseurl.post("/user/verifyAccount", formData);
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
export const verifyPasswordOTP = async (email, otp) => {
  

  try {
    const response = await baseurl.post("/user/verify-otp", email, otp);
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
    throw (
      error.response?.data?.msg || "Failed to get profile. Please try again."
    );
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
    throw (
      error.response?.data?.message || "Failed to update profile. Please try again."
    );
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
    throw new Error(error.response?.data?.message || "Failed to update password. Please try again.");
  }
};

