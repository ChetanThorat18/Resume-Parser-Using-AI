const express = require("express");
const router = express.Router();
const { uploadFiles } = require("../controllers/upload");
const upload = require("../multer"); // Multer middleware

// route for uploading resumes
router.post("/upload", upload.array("resumes", 20), uploadFiles);

module.exports = router;