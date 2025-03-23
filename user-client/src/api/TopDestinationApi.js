import { baseurl } from "./baseURL";

export const getTopDestinations = async () => {
  try {
    const response = await baseurl.get("/package/destinations");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.msg ||
      "Failed to get top destination. Please try again."
    );
  }
};

export const getTopDestinationPackages = async (destinationName) => {
  try {
    const response = await baseurl.get(
      `/package/?destination=${destinationName}`
    );
    return response.data.data;
  } catch (error) {
    throw (
      error.response?.data?.msg ||
      "Failed to get top destination. Please try again."
    );
  }
};

// get package details 
export const getPackageDetail = async (packageId) => {
    if (!packageId) {
      throw new Error("Package ID is required.");
    }
  
    try {
      const response = await baseurl.get(`/package/?packageId=${packageId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.msg || "Failed to get package details."
      );
    }
  };
  


  export const getTopPackages = async () => {
    try {
      const response = await baseurl.get(
        `/package`
      );
      return response.data.data;
    } catch (error) {
      throw (
        error.response?.data?.msg ||
        "Failed to get package details. Please try again."
      );
    }
  };

