import axiosInstance from "../utils/axios";

export const login_async = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
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
