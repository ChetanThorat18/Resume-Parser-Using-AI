import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import Resume from "./models/Resume.js";  // Update the path based on your project structure
import Result from "./models/Result.js";  // Update the path based on your project structure

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function deleteCloudinaryFiles() {
  try {
    console.log("Fetching files from Cloudinary...");
    
    // Get all uploaded files (list all resources)
    const { resources } = await cloudinary.v2.api.resources({ max_results: 100 });

    if (resources.length === 0) {
      console.log("No files found on Cloudinary.");
      return;
    }

    // Extract public_ids of files
    const publicIds = resources.map((file) => file.public_id);

    // Delete all files
    const result = await cloudinary.v2.api.delete_resources(publicIds);
    console.log("Cloudinary files deleted:", result);
  } catch (error) {
    console.error("Error deleting Cloudinary files:", error);
  }
}

async function deleteMongoData() {
  try {
    // Delete all documents from the "resumes" collection
    const resumeDelete = await Resume.deleteMany({});
    console.log(`${resumeDelete.deletedCount} resumes deleted`);

    // Delete all documents from the "results" collection
    const resultDelete = await Result.deleteMany({});
    console.log(`${resultDelete.deletedCount} results deleted`);
  } catch (error) {
    console.error("Error deleting MongoDB data:", error);
  }
}

async function cleanUp() {
  await deleteCloudinaryFiles();
  await deleteMongoData();
  mongoose.connection.close(); // Close MongoDB connection after completion
  console.log("Cleanup process completed.");
}

// Run the cleanup process
cleanUp();