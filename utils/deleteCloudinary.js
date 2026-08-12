import cloudinary from "../config/cloudinary.js";

const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== "string") return;

    // Only delete Cloudinary-hosted images
    if (!imageUrl.includes("res.cloudinary.com")) return;

    // Example:
    // https://res.cloudinary.com/demo/image/upload/v123/glamira-products/abc.webp
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);

    if (!match?.[1]) return;

    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Cloudinary Delete Error:", error.message);
  }
};

export default deleteCloudinaryImage;
