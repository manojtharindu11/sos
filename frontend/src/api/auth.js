import axiosInstance from "../utils/axios";

export const login_async = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (response) {
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup_async = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem("accessToken");
};

const setAccessToken = (token) => {
  sessionStorage.setItem("accessToken", token);
};

const setRefreshToken = (token) => {
  sessionStorage.setItem("refreshToken", token);
};
