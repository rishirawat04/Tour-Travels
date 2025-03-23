export const successHandler = (res, message, data = {}, statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  