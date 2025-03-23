import { baseurl } from "./baseURL";

export const getUserDetails = async () => {
  try {
    const response = await baseurl.get("/user/details");
  } catch (error) {
    throw error;
  }
};

export const getTickets = async () => {
  try {
    const response = await baseurl.get("/ticket/alltickets");

    return response;
  } catch (error) {
    throw error;
  }
};

export const getDestinationPackages = async () => {
  try {
    const response = await baseurl.get("/package/allData");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await baseurl.get("/user/details");
    return response;
  } catch (error) {
    throw error;
  }
};
