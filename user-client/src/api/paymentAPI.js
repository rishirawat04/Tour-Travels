import { baseurl } from "./baseURL";

export const applyCoupon = async ({code, cartAmount}) => {
  try {
    const response = await baseurl.post(
      "/discount/apply",
      {
        code,
        cartAmount,
      },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    // Check if it's an authentication error (401)
    if (error.response && error.response.status === 401) {
      throw {
        ...error,
        isAuthError: true,
        message: error.response.data?.message || "Please login to apply a discount code"
      };
    }
    
    // Handle other errors
    throw {
      ...error,
      message: error.response?.data?.message || "Failed to apply coupon. Please check the code and try again."
    };
  }
};

export const createOrder = async ({packageId, totalAmount, quantity, discountCode}) => {
    try {
      const response = await baseurl.post(
        "/payment/order",
        {
            packageId, 
            totalAmount,
            quantity, 
            discountCode
        },
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      // Check if it's an authentication error (401)
      if (error.response && error.response.status === 401) {
        console.error("Authentication error in createOrder:", error.response?.data);
        throw {
          ...error,
          isAuthError: true,
          message: error.response.data?.message || "Please login to continue with your booking"
        };
      }
      
      // Handle other errors
      console.error("Payment order error:", error.response?.data || error.message);
      throw {
        ...error,
        message: error.response?.data?.message || "Failed to create order. Please try again."
      };
    }
  };

export const verifyOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
    try {
      const response = await baseurl.post(
        "/payment/verify",
        {
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        },
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      // Check if it's an authentication error (401)
      if (error.response && error.response.status === 401) {
        throw {
          ...error,
          isAuthError: true,
          message: error.response.data?.message || "Please login to continue with payment verification"
        };
      }
      
      // Handle other errors
      throw {
        ...error,
        message: error.response?.data?.message || "Failed to verify payment. Please contact support."
      };
    }
  };

// get orders details 
export const getOrderDetials = async (userId) => {
    try {
      const response = await baseurl.get(
        `/payment/bookings/${userId}/summary`,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      // Check if it's an authentication error (401)
      if (error.response && error.response.status === 401) {
        throw {
          ...error,
          isAuthError: true,
          message: error.response.data?.message || "Please login to view your booking details"
        };
      }
      
      // Handle other errors
      throw {
        ...error,
        message: error.response?.data?.message || "Failed to retrieve booking details. Please try again."
      };
    }
  };


  // get payments details 
export const getPaymentDetials = async (userId) => {
    try {
      const response = await baseurl.get(
        `/payment/transactions/${userId}`,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      // Check if it's an authentication error (401)
      if (error.response && error.response.status === 401) {
        throw {
          ...error,
          isAuthError: true,
          message: error.response.data?.message || "Please login to view your payment details"
        };
      }
      
      // Handle other errors
      throw {
        ...error,
        message: error.response?.data?.message || "Failed to retrieve payment details. Please try again."
      };
    }
  };

