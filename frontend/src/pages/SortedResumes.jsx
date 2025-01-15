import React, { useEffect, useState } from "react";
import { fetchMatchingScores } from "../utils/api";
import ResumeTable from "../components/ResumeTable";

const SortedResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResumes = async () => {
      try {
        const data = await fetchMatchingScores();
        setResumes(data.data); // Set the resumes
        console.log(resumes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    getResumes();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading resumes...</p>;
  }

  return <ResumeTable resumes={resumes} />;
};

export default SortedResumes;