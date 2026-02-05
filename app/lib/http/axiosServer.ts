import axios from "axios";

function getServerBaseUrl() {
  return (
    process.env.BASE_URL_SERVER ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:8000"
  );
}

// Server-side axios instance.
// Uses BASE_URL_SERVER (preferred) so it never depends on the Next.js origin.
export const axiosServer = axios.create({
  baseURL: getServerBaseUrl(),
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
  // Allow callers to handle non-2xx responses explicitly.
  validateStatus: () => true,
});
