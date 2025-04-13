import { baseurl } from "./baseURL";

/**
 * Get all blogs from the API
 * @returns {Promise<Array>} - Array of blog posts
 */
export const getBlogs = async () => {
  try {
    const response = await baseurl.get("/blog");
    
    // Check response structure and ensure we return an array
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response && response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn("Unexpected blog API response structure:", response);
      // Try to find an array in the response
      if (response.data && typeof response.data === 'object') {
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            return response.data[key];
          }
        }
      }
      return []; // Return empty array if no suitable data found
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return []; // Return empty array on error
  }
};

/**
 * Get blog by ID from the API
 * @param {string} blogId - ID of the blog to retrieve
 * @returns {Promise<Object>} - Blog post data
 */
export const getBlogsById = async (blogId) => {
  if (!blogId) {
    console.error("Blog ID is required");
    return null;
  }
  
  try {
    const response = await baseurl.get(`/blog/${blogId}`);
    
    // Check response structure and ensure we return blog data
    if (response && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected blog API response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return null; // Return null on error
  }
};