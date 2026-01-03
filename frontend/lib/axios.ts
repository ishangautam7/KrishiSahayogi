import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:7000/api/v1";

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add the token to headers
// apiClient.interceptors.request.use(
//     (config) => {
//         const token = Cookies.get("token");
//         console.log(token);
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default apiClient;
