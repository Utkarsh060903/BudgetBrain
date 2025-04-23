import axios from "axios";

import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    Accept: "application/json",
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        else if (error.response.status === 500) {
            console.log("Internal Server Error. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
