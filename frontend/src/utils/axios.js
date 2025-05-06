import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach the access token
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to refresh token
const refreshToken = async () => {
  try {
    const token = sessionStorage.getItem("refreshToken");
    const response = await axios.post(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      }/api/v1/auth/refresh`,
      { token: token }
    );
    const newAccessToken = response.data.newAccessToken;
    sessionStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry original request
      } catch (err) {
        // Refresh token failed – logout user
        sessionStorage.clear(); // or remove only accessToken and refreshToken
        window.location.href = "/home/login"; // Redirect to login
        return Promise.reject({
          message: "Session expired. Please log in again.",
        });
      }
    } else if (status >= 500) {
      console.log("Server error. Please try again later.");
    } else if (status === 422) {
      const errors = error.response.data.errors;
      for (const err of errors) {
        console.log(err.msg);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
