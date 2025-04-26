export const BASE_URL = "https://budgetbrain-server.onrender.com";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GOOGLE_LOGIN: "/api/v1/auth/google-login",
        GET_USER_INFO: "/api/v1/auth/getUser",
        UPLOAD_IMAGE: "/api/v1/auth/upload-image"
    },

    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },

    INCOME: {
        GET_ALL_INCOME: "/api/v1/income/get",
        ADD_INCOME: "/api/v1/income/add",
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/v1/income/download",
    },

    EXPENSE: {
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        ADD_EXPENSE: "/api/v1/expense/add",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "/api/v1/expense/download",
    },

    HISTORY: {
        GET_MONTHLY_HISTORY: '/api/v1/history/monthly',
        GET_MONTH_DETAILS: (month, year) => `/api/v1/history/details/${month}/${year}`,
        DOWNLOAD_MONTHLY_REPORT: (month, year) => `/api/v1/history/download/${month}/${year}`
    },

    GOALS: {
        GET_ALL_GOALS: "/api/v1/goals",
        ADD_GOAL: "/api/v1/goals",
        DELETE_GOAL: (id) => `/api/v1/goals/${id}`,
        UPDATE_GOAL: (id) => `/api/v1/goals/${id}`,
    },
}