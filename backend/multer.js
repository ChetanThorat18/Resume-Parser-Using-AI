const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // Import the configured Cloudinary instance

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes", // Cloudinary folder name
    allowed_formats: ["pdf", "doc", "docx"], // Allowed file formats
    resource_type: "auto",  // Set resource_type to "raw" for non-image files like PDFs
    // transformation: [
    //   { quality: "auto", fetch_format: "auto" }, // Automatically optimize quality and fetch format
    // ],
  },
});

// Set up multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;