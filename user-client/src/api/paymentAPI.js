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
    throw error;
  }
};

export const createOrder = async ({packageId, totalAmount, quantity, discountCode}) => {
    try {
      const response = await baseurl.post(
        "/payment/order",
        {
            packageId, 
            totalAmount,
            quantity, discountCode
        },
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  };

