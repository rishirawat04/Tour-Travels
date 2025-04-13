import { baseurl } from "./baseURL";

/**
 * Get top destinations from the API
 * @returns {Promise<Array>} - An array of destinations
 */
export const getTopDestinations = async () => {
  try {
    const response = await baseurl.get("/package/destinations");
    
    // Ensure we return an array, even if the structure is unexpected
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn("Unexpected API response structure:", response);
      // Try to find an array in the response
      if (response.data && typeof response.data === 'object') {
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            return response.data[key];
          }
        }
      }
      // Return empty array if we can't find any array data
      return [];
    }
  } catch (error) {
    console.error("Error fetching top destinations:", error);
    // Return an empty array instead of throwing to prevent app crashes
    return [];
  }
};

export const getTopDestinationPackages = async (destinationName) => {
  try {
    const response = await baseurl.get(
      `/package/?destination=${destinationName}`
    );
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn("Unexpected API response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching destination packages:", error);
    return [];
  }
};

// get package details 
export const getPackageDetail = async (packageId) => {
  if (!packageId) {
    console.error("Package ID is required.");
    return null;
  }

  try {
    const response = await baseurl.get(`/package/?packageId=${packageId}`);
    
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else {
      console.warn("Unexpected API response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching package details:", error);
    return null;
  }
};

export const getTopPackages = async () => {
  try {
    const response = await baseurl.get(`/package`);
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn("Unexpected API response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching top packages:", error);
    return [];
  }
};

