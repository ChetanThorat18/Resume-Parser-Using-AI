const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
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
      type: String, // Cloudinary URL or local path
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