import { baseurl } from "./baseURL";

export const getCategoryPackages = async () => {
  try {
    const response = await baseurl.get(
      "/admin/category/getAllStatesOfCategory"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllPackages = async () => {
  try {
    const response = await baseurl.get("/admin/package/getAllPackages");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllReviews = async () => {
  try {
    const response = await baseurl.get("/testimonial/getAllReview");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllCoupon = async () => {
  try {
    const response = await baseurl.get("/admin/coupon/allstats");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllTickets = async () => {
  try {
    const response = await baseurl.get("/admin/ticket/allticketsStats");
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a new category
export const createCategory = async (formData) => {
  try {
    const response = await baseurl.post("/admin/category", formData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCategorybyId = async (categoryId) => {
  try {
    const response = await baseurl.get(`/category/${categoryId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCategorybyId = async (categoryId, formData) => {
  try {
    const response = await baseurl.put(
      `/admin/category/${categoryId}`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteByCategory = async (categoryId) => {
  try {
    const response = await baseurl.delete(`/admin/${categoryId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// create a new package
export const createPackage = async (formData) => {
  try {
    const response = await baseurl.post("/admin/package", formData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPackageById = async (packageId) => {
  try {
    const response = await baseurl.get(`/admin/getPackageById/${packageId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePackageById = async (packageId, formData) => {
  try {
    const response = await baseurl.put(
      `/admin/package/update/${packageId}`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePackageById = async (packageId, formData) => {
  try {
    const response = await baseurl.put(`/admin/package/delete/${packageId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// //////////////create a new tourMap package////////////////
export const createTourMap = async (formData) => {
  try {
    const response = await baseurl.post("/admin/package/tour-maps", formData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// create a coupon
export const createCoupon = async (formData) => {
  try {
    const response = await baseurl.post("/admin/coupon", formData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCoupon = async (couponId, status) => {
  try {
    const response = await baseurl.put(`/admin/coupon/${couponId}`, status, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const response = await baseurl.delete(`/admin/coupon/${couponId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await baseurl.delete(`/admin/review/${reviewId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (reviewId, status) => {
  try {
    const response = await baseurl.put(`/admin/review/${reviewId}`, status, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
