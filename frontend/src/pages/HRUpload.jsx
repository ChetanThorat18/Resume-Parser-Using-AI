import React, { useState } from "react";
import axios from "axios";
import SortedResumes from "./SortedResumes";
import { FileText, Upload, FilePlus, CheckCircle } from "lucide-react";

const HRUpload = () => {
  const [jobDescription, setJobDescription] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSortedResumes, setShowSortedResumes] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleJobDescriptionUpload = (event) => {
    setJobDescription(event.target.files[0]);
  };

  const handleResumeUpload = (event) => {
    const files = Array.from(event.target.files);
    setResumes((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    if (jobDescription) {
      formData.append("jobDescription", jobDescription);
    }
    resumes.forEach((file) => formData.append("resumes", file));

    try {
      const response = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Files uploaded successfully!");
      setUploadedFiles(response.data);
      setShowSortedResumes(true);
    } catch (error) {
      alert("Error uploading files");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (showSortedResumes) {
    return <SortedResumes />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center py-12 px-4">
    <div className="relative w-full max-w-2xl">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 hidden lg:block">
        <div className="h-64 w-64 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse-slow" />
      </div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 hidden lg:block">
        <div className="h-48 w-48 bg-purple-500/5 rounded-full filter blur-3xl opacity-70 animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
      </div>
      
      <div className="w-full border border-border/50 shadow-xl backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 rounded-xl overflow-hidden">
        <div className="pb-4 pt-6 px-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Resume Matching
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Upload a job description and resumes to find the best matches
          </p>
        </div>
        
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="jobDescription" className="text-base font-medium">
                  Job Description
                </label>
                {jobDescription && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    File selected
                  </span>
                )}
              </div>
              
              <div className="rounded-lg border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors p-4 cursor-pointer bg-gray-50/30 relative">
                <input
                  id="jobDescription"
                  type="file"
                  accept=".pdf"
                  onChange={handleJobDescriptionUpload}
                  className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <FilePlus className="h-8 w-8 text-gray-400" />
                  <p className="text-base font-medium">
                    {jobDescription ? jobDescription.name : "Drop your PDF job description here"}
                  </p>
                  <p className="text-xs text-blue-200">
                    (or click to browse)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="resumes" className="text-base font-medium">
                  Candidate Resumes
                </label>
                {resumes.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {resumes.length} {resumes.length === 1 ? "file" : "files"} selected
                  </span>
                )}
              </div>
              
              <div className="rounded-lg border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors p-4 cursor-pointer bg-gray-50/30 relative">
                <input
                  id="resumes"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-base font-medium">
                    {resumes.length > 0
                      ? `${resumes.length} ${resumes.length === 1 ? "resume" : "resumes"} selected`
                      : "Drop resume files here"}
                  </p>
                  <p className="text-xs text-blue-200">
                    Supports PDF, DOC, DOCX (or click to browse)
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium py-4 px-4 rounded-md transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isUploading || (!jobDescription && resumes.length === 0)}
            >
              {isUploading ? (
                <>
                  <div className="h-5 w-5 animate-spin mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Uploading...
                </>
              ) : (
                "Match Resumes"
              )}
            </button>
          </form>

          {uploadedFiles.resumes && uploadedFiles.resumes.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                Uploaded Files
              </h3>
              <ul className="space-y-2">
                {uploadedFiles.resumes.map((file, index) => (
                  <li key={index} className="flex items-center p-2 rounded-md bg-gray-50/50 text-sm">
                    <FileText className="h-4 w-4 text-primary mr-2" />
                    <span className="font-medium">{file.filename}</span>
                    <span className="text-gray-500 mx-2">•</span>
                    <span className="text-xs text-gray-500">{file.contentType}</span>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-auto text-primary hover:underline text-xs"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default HRUpload;