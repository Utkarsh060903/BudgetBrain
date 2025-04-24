import axiosInstance from "./axiosInstance.js";
import { API_PATHS } from "./apiPaths.js";

export const uploadImage = async (file) => {
  try {
    // Create a FormData instance
    const formData = new FormData();
    formData.append("image", file);

    // Create a modified axios instance for file upload
    const response = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Override the default content type
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};