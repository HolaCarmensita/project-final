import multer from 'multer';

// Keep files in memory as Buffer for Cloudinary upload
const storage = multer.memoryStorage();

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  // Allow images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer for Cloudinary uploads
const upload = multer({
  storage: storage, // Keep in memory for Cloudinary
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files per request
  },
});

export default upload;
