import axios from "axios";

// Browser-side axios instance.
// Points at the backend API base URL (e.g. http://localhost:8000).
export const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});
