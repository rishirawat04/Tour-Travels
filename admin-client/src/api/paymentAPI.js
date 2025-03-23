import { baseurl } from "./baseURL";

export const getPaymentStats = async () => {
  try {
    const response = await baseurl.get("/admin/payments/payment-statistics", {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookedTourStats = async () => {
  try {
    const response = await baseurl.get("/admin/payments/tour-statistics", {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentByAdmin = async ({ paymentId, orderId }) => {
  try {
    const response = await baseurl.post(
      "/admin/payments/verify-payment",
      {
        paymentId,
        orderId,
      },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteBookedTour = async (tourId) => {
  try {
    const response = await baseurl.delete(
      `/admin/booked/delete-tour/${tourId}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateBookedTourStatus = async ({ tourId, newStatus }) => {
  try {
    const response = await baseurl.put(
      "/admin/booked/update-status",
      {
        tourId,
        newStatus,
      },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};


export const getTourDetailsByUserId = async (bookingId) => {
   
    
    try {
      const response = await baseurl.get(
        `/admin/booked-tours/${bookingId}`,

        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
