import axios from "axios";

const httpClient = axios.create({
    baseURL: "http://localhost:9000",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

/* Request interceptor */
httpClient.interceptors.request.use((config) => {
    return config;
});

/* Response interceptor: handle global errors */
httpClient.interceptors.response.use(
    /* pass through successful responses */
    async (response) => {
        return Promise.resolve(response.data);
    },
    async (error) => {
        return Promise.reject(error);
    }
);

export default httpClient;
