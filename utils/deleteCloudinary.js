import cloudinary from "../config/cloudinary.js";


const deleteCloudinaryImage = async (imageUrl) => {
  try {

    if (!imageUrl) return;


    const parts = imageUrl.split("/");

    const fileName = parts[parts.length - 1];

    const publicId = `glamira-products/${fileName.split(".")[0]}`;


    await cloudinary.uploader.destroy(publicId);


  } catch (error) {
    console.log("Cloudinary Delete Error:", error.message);
  }
};


export default deleteCloudinaryImage;