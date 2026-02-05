import axios from "axios";

// Browser-side axios instance.
// Points at the backend API base URL (e.g. http://localhost:8000).
export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});
