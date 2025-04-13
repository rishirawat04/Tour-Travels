import { baseurl } from "./baseURL";

/**
 * Get testimonials from the API
 * @returns {Promise<Object>} - The testimonial data
 */
export const getTestimonial = async () => {
  try {
    const response = await baseurl.get("/testimonial");
    
    // Return the entire response so we can check its structure in the component
    return response;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    const errorMessage =
      error.response?.data?.msg || "Failed to get testimonials. Please try again.";
    throw new Error(errorMessage);
  }
};