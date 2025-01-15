import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // Your Node.js server URL
});

export const fetchMatchingScores = async () => {
  const response = await API.get("/matching-scores");
  return response.data;
};