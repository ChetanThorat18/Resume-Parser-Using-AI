import React, { useState } from 'react';
import axios from 'axios';

const HRUpload = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleJDChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleResumeUpload = (event) => {
    const files = Array.from(event.target.files);
    setResumes((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    resumes.forEach((file) => formData.append('resumes', file));

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Files uploaded successfully!');
      setUploadedFiles(response.data.files); // Update uploaded files state
    } catch (error) {
      alert('Error uploading files');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Job Description and Resume Upload
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={handleJDChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows="6"
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Upload Resumes</label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {resumes.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-700">Selected Resumes</h2>
              <ul className="list-disc list-inside text-gray-600">
                {resumes.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition"
          >
            Upload Files
          </button>
        </form>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-700">Uploaded Files</h2>
            <ul className="list-disc list-inside text-gray-600">
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  <strong>{file.filename}</strong> ({file.contentType}) -{' '}
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRUpload;