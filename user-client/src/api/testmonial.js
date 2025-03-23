import { baseurl } from "./baseURL";

export const getTestimonial = async () => {
    try {
      const response = await baseurl.get("/testimonial");
  
      return response;
  
    } catch (error) {
     
      const errorMessage =
        error.response?.data?.msg || "get request failed. Please try again.";
      throw new Error(errorMessage);
     
      
    }
  };