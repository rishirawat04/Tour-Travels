import { baseurl } from "./baseURL";

export const getBlogs = async () => {
    try {
      const response = await baseurl.get("/blog");
  
      return response;
  
    } catch (error) {
    
      const errorMessage =
        error.response?.data?.msg || "get request failed. Please try again.";
      throw new Error(errorMessage);
     
      
    }
  };

  export const getBlogsById = async (blogId) => {
    try {
      const response = await baseurl.get(`/blog/${blogId}`);
  
      return response;
  
    } catch (error) {
     
      const errorMessage =
        error.response?.data?.msg || "get request failed. Please try again.";
      throw new Error(errorMessage);
     
      
    }
  };