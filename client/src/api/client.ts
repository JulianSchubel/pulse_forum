import axios from "axios";

/* Optional: you can import your toast/snackbar util here */
import { showToast } from "../utilities/toast";

const httpClient = axios.create({
    baseURL: "http://localhost:9000",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

/* Request interceptor: attach JWT */
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* Response interceptor: handle global errors */
httpClient.interceptors.response.use(
    /* pass through successful responses */
    async (response) => {
        return Promise.resolve(response.data);
    },
    async (error) => {
        const { response } = error;

        if (!response) {
            showToast("Network error. Please check your connection.", "error");
            return Promise.reject(error);
        }

        /* Handle 401 Unauthorized */
        if (response.status === 401) {
            showToast("Your session has expired. Please log in again.", "warning");
            //await AuthService.logout();

            /* Optional: force redirect to login page */
            window.location.href = "/login";
            return Promise.reject(error);
        }

        /* Handle 403 Forbidden */
        if (response.status === 403) {
            showToast("You do not have permission to perform this action.", "error");
        }

        /* Handle 404 Not Found */
        if (response.status === 404) {
            showToast("The requested resource could not be found.", "error");
        }

        /* Handle 500+ server errors */
        if (response.status >= 500) {
            showToast("A server error occurred. Please try again later.", "error");
        }

        /* Default case */
        if (response.data?.message) {
            showToast(response.data.message, "error");
        }

        return Promise.reject(error);
    }
);

export default httpClient;

