import cloudinary from '../utils/cloudinary.js';


const deleteImageFromCloudinary = async (imageUrl, folder = 'toursAndTravel') => {
    try {
      if (imageUrl) {
        const publicId = imageUrl.split('/').pop().split('.')[0]; 
        await cloudinary.v2.uploader.destroy(`${folder}/${publicId}`); 
      }
    } catch (error) {
      throw new Error('Error deleting image from Cloudinary');
    }
  };
  
  export default deleteImageFromCloudinary