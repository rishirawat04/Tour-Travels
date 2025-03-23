import cloudinary from "../utils/cloudinary.js";
import { Readable } from 'stream';  

// Cloudinary image upload function using streams
 const uploadImageToCloudinary = (file, folder = 'toursAndTravel') => {
  return new Promise((resolve, reject) => {
    const stream = new Readable();
    stream.push(file.data);  
    stream.push(null); 

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder,
        quality: "auto",
        fetch_format: "auto",
       },
      (error, result) => {
        if (error) {
          return reject(error); 
        }
        resolve(result.secure_url); 
      }
    );

    // Pipe the file stream to Cloudinary's upload stream
    stream.pipe(uploadStream);
  });
};

export default uploadImageToCloudinary



