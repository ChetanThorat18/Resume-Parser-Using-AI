import React from "react";

const ResumeTable = ({ resumes }) => {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Resume Matching Scores
      </h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Filename</th>
            <th className="border border-gray-300 p-2">Matching Score</th>
            <th className="border border-gray-300 p-2">Skills Matched</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
  {resumes.map((resume) => {
    console.log(resume.url); // Logs the URL to the console for debugging

    return (
      <tr key={resume.reference_id} className="hover:bg-gray-100">
        <td className="border border-gray-300 p-2">{resume.filename}</td>
        <td className="border border-gray-300 p-2">
          {resume.matching_score.toFixed(2)}
        </td>
        <td className="border border-gray-300 p-2">
          {resume.skills_matched.join(", ")}
        </td>
        <td className="border border-gray-300 p-2 text-center">
          <a
            href={
              resume.url && resume.url.startsWith("http")
                ? resume.url
                : `https://${resume.url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Resume
          </a>
        </td>
      </tr>
    );
  })}
</tbody>
      </table>
    </div>
  );
};

export default ResumeTable;
