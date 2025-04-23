import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred";

      console.error(`Error ${status}: ${message}`);
      if (status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        // window.location.href = '/login';
      } else if (status === 403) {
        // Handle forbidden access
        alert("You do not have permission to access this resource.");
      } else if (status >= 500) {
        // Handle server errors
        alert("Server error. Please try again later.");
      }

      return Promise.reject({ status, message, originalError: error });
    } else if (error.request) {
      console.error("No response received:", error.request);
      return Promise.reject({
        message: "No response from server. Please check your network",
        originalError: error,
      });
    } else {
      console.error("Axios error:", error.message);
      return Promise.reject({ message: error.message, originalError: error });
    }
  }
);

export default axiosInstance;
