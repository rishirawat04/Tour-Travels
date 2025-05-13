import { baseurl } from "./baseURL";

/**
 * Get all blogs from the API
 * @returns {Promise<Array>} - Array of blog posts
 */
export const getBlogs = async () => {
  try {
    const response = await baseurl.get("/blog");
    
    // Enhanced response handling
    if (!response || !response.data) {
      console.warn("Empty response from blog API");
      return [];
    }
    
    const data = response.data;
    
    // Case 1: Response is already an array
    if (Array.isArray(data)) {
      return data;
    }
    
    // Case 2: Response has a data property that is an array
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    }
    
    // Case 3: Response has a blogs property that is an array
    if (data && typeof data === 'object' && Array.isArray(data.blogs)) {
      return data.blogs;
    }
    
    // Case 4: Look for any array property in the response
    if (data && typeof data === 'object') {
      for (const key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          return data[key];
        }
      }
    }
    
    // Case 5: If response is a blog object itself, wrap it in an array
    if (data && typeof data === 'object' && (data.title || data._id)) {
      return [data];
    }
    
    console.warn("Unexpected blog API response structure:", response);
    return []; // Return empty array if no suitable data found
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