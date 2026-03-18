import axios from "axios";

// Browser-side axios instance.
// Points at the backend API base URL (e.g. http://localhost:8000).
export const axiosClient = axios.create({
  baseURL: process.env.SERVER_PRODUCTION_URL || "https://sweet-homes-user-auth-be.onrender.com/api",
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});
