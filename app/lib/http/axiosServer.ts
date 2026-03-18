import axios from "axios";

function getServerBaseUrl() {
  return (
    process.env.SERVER_PRODUCTION_URL ||
    "https://sweet-homes-user-auth-be.onrender.com/api"
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
