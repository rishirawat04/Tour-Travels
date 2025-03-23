import { baseurl } from "./baseURL";

export const getFavourite = async (userId) => {
  try {
    const response = await baseurl.get(`/favourite/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addFavourite = async (userId, packageId) => {
  try {
    const response = await baseurl.post(
      `/favourite`,
      { userId, packageId },
      {
        withcredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFavourite = async (userId, packageId) => {
  try {
    const response = await baseurl.post(
      `/favourite/delete`,
      { userId, packageId },
      {
        withcredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Suport Ticket

export const getSupportTickets = async () => {
  try {
    const response = await baseurl.get(`/ticket`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSupportTickets = async (userId, subject) => {
  try {
    const response = await baseurl.post(
      `/ticket`,
      { userId, subject },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const closeTicket = async (ticketId) => {
  try {
    const response = await baseurl.patch(
      `/ticket/user/status`,
      { ticketId },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// post support tickets chats

export const createTicketChat = async (ticketId, message) => {
  try {
    const response = await baseurl.post(
      `/chat`,
      { ticketId, message },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTicketChat = async (ticketId) => {
  try {
    const response = await baseurl.get(`/chat/${ticketId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSearchResults = async (location, date) => {
  try {
    const response = await baseurl.get(`/package/search`, {
      params: {
        destination: location,
        startDate: date,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
