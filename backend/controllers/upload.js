const Resume = require("../models/Resume");
const cloudinary = require("../cloudinary");

// Upload Resumes and Job Description
const uploadFiles = async (req, res) => {
  const resumes = req.files.resumes;
  const jobDescriptionFile = req.files.jobDescription?.[0];

  if (!resumes || resumes.length === 0) {
    console.error("No resumes uploaded.");
    return res.status(400).json({ message: "No resumes uploaded." });
  }

  if (!jobDescriptionFile) {
    console.error("No job description file uploaded.");
    return res.status(400).json({ message: "No job description file uploaded." });
  }

  try {
    const uploadedResumes = [];

    // Save the job description file metadata
    const jobDescription = {
      filename: jobDescriptionFile.originalname,
      contentType: jobDescriptionFile.mimetype,
      url: jobDescriptionFile.path,
      public_id: jobDescriptionFile.filename,
    };

    // Save each resume metadata
    for (const file of resumes) {
      const newResume = new Resume({
        jobDescription: jobDescription.url,
        filename: file.originalname,
        contentType: file.mimetype,
        url: file.path, // Cloudinary URL
        public_id: file.filename, // Cloudinary public ID
      });

      const savedResume = await newResume.save();
      uploadedResumes.push(savedResume);
    }

    res.status(200).json({
      message: "Files uploaded successfully!",
      jobDescription,
      resumes: uploadedResumes,
    });
  } catch (error) {
    console.error("Error during upload process:", error.message);
    res.status(500).json({
      message: "Error uploading files",
      error: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
};
