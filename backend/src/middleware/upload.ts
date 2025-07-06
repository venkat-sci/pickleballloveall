import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads/profile-pictures");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Storage destination called, uploadsDir:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `profile-${uniqueSuffix}${ext}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

// File filter to only allow images
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  console.log("File filter called with:", file);
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    console.log("Rejecting file with mimetype:", file.mimetype);
    cb(new Error("Only image files are allowed"));
  }
};

export const profilePictureUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only one file
  },
  fileFilter: fileFilter,
});

// Middleware to handle upload errors
export const handleUploadError = (
  error: any,
  req: any,
  res: any,
  next: any
) => {
  console.log("Upload middleware error:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size too large. Maximum size is 5MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Too many files. Only one file allowed.",
      });
    }
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({
      message: "Only image files are allowed.",
    });
  }

  console.log("Unhandled upload error:", error);
  return res.status(500).json({
    message: "File upload error.",
  });
};
