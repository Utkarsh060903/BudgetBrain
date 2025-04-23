// import { API_PATHS } from "./apiPaths.js";

// import axiosInstance from "./axiosInstance.js";

// export const uploadImage = async (imageFile) => {
//   const formData = new FormData();
//   formData.append("image", imageFile);

//   try {
//     const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error;
//   }
// }


import { API_PATHS } from "./apiPaths.js";
import axiosInstance from "./axiosInstance.js";

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}