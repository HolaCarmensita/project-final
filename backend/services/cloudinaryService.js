import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables explicitly
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
const uploadImage = async (file) => {
  try {
    // Convert buffer to base64 string
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'ideas', // Organize images in a folder
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Resize for better performance
        { quality: 'auto' }, // Optimize quality
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Upload multiple images
const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    // Check if all uploads were successful
    const failedUploads = results.filter((result) => !result.success);
    if (failedUploads.length > 0) {
      return {
        success: false,
        error: 'Some images failed to upload',
        failedUploads,
      };
    }

    // Extract URLs from successful uploads
    const imageUrls = results.map((result) => result.url);

    return {
      success: true,
      urls: imageUrls,
    };
  } catch (error) {
    console.error('Multiple image upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete image from Cloudinary (for cleanup)
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};
