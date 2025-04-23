export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/V1/auth/login",
        REGISTER: "/api/V1/auth/register",
        GET_USER_INFO: "/api/V1/auth/getUser",
        UPLOAD_IMAGE: "/api/V1/auth/upload-image"
    },

    DASHBOARD: {
        GET_DATA: "/api/V1/dashboard",
    },

    INCOME: {
        GET_ALL_INCOME: "/api/V1/income/get",
        ADD_INCOME: "/api/V1/income/add",
        DELETE_INCOME: (incomeId) => `/api/V1/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/V1/income/download",
    },

    EXPENSE: {
        GET_ALL_EXPENSE: "/api/V1/expense/get",
        ADD_EXPENSE: "/api/V1/expense/add",
        DELETE_EXPENSE: (expenseId) => `/api/V1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "/api/V1/expense/download",
    }
}