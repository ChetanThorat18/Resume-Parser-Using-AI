const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String, // Updated to store URL of the uploaded job description PDF
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    url: {
      type: String, // Cloudinary URL 
      required: true,
    },
    public_id: {
      type: String, // Cloudinary public ID or unique identifier
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', ResumeSchema);
