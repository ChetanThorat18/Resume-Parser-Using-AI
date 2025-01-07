const Resume = require("../models/Resume");
const cloudinary = require("../cloudinary");

// Upload Resumes
const uploadFiles = async (req, res) => {
    const files = req.files;
    const jobDescription = req.body.jobDescription;
  
    if (!files || files.length === 0) {
      console.error("No files uploaded.");
      return res.status(400).json({ message: "No files uploaded." });
    }
  
    try {
      const uploadedResumes = [];
  
      for (const file of files) {
        console.log("Processing file:", file);
  
        // Save file metadata to MongoDB
        const newResume = new Resume({
          jobDescription: jobDescription || null,
          filename: file.originalname,
          contentType: file.mimetype,
          url: file.path, // Cloudinary URL already provided
          public_id: file.filename, // Cloudinary public ID
        });
  
        const savedResume = await newResume.save();
        console.log("Saved Resume in MongoDB:", savedResume);
  
        uploadedResumes.push(savedResume);
      }
  
      res.status(200).json({
        message: "Files uploaded successfully!",
        files: uploadedResumes,
      });
    } catch (error) {
      console.error("Error during upload process:", error.message);
      res.status(500).json({
        message: "Error uploading files",
        error: error.message,
      });
    }
  };

// Export the upload logic and multer middleware
module.exports = {
  uploadFiles,
};