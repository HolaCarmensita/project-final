import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a single image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'ideas', 'profiles')
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImage = async (file, folder = 'ideas') => {
  try {
    // Create a unique filename using timestamp and original name
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;

    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {string} folder - The folder path in storage
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleImages = async (files, folder = 'ideas') => {
  try {
    // Upload all files in parallel
    const uploadPromises = files.map((file) => uploadImage(file, folder));

    // Wait for all uploads to complete
    const downloadURLs = await Promise.all(uploadPromises);

    return downloadURLs;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images');
  }
};
