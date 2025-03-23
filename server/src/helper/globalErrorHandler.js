const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
  
    // Specific handling for validation errors or other known types
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    }
  
    if (err.code === 11000) {
      // MongoDB duplicate key error
      statusCode = 400;
      const field = Object.keys(err.keyValue)[0];
      message = `${field} already exists.`;
    }
  
    // Send error response
    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  };
  
  export default errorHandler;




// import CustomError from "../utils/CustomError.js";
// import { successHandler } from "../utils/successHandler.js";



  