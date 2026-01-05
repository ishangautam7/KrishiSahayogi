import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API URL - Using correct IP from Metro Bundler
const API_BASE_URL = 'http://192.168.1.64:7000/api/v1';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error reading token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear storage and redirect to login
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// API functions
export const api = {
    // Auth
    login: (credentials: { email: string; password: string }) =>
        apiClient.post('/auth/login', credentials),

    register: (userData: any) =>
        apiClient.post('/auth/register', userData),

    getProfile: () =>
        apiClient.get('/auth/me'),

    // Products
    getProducts: (params?: any) =>
        apiClient.get('/product', { params }),

    getProduct: (id: string) =>
        apiClient.get(`/product/${id}`),

    createProduct: (data: any) =>
        apiClient.post('/product', data),

    updateProduct: (id: string, data: any) =>
        apiClient.put(`/product/${id}`, data),

    deleteProduct: (id: string) =>
        apiClient.delete(`/product/${id}`),

    // Users
    getUsers: (params?: any) =>
        apiClient.get('/user', { params }),

    getUserProfile: (id: string) =>
        apiClient.get(`/user/${id}`),

    // Messages
    getMessages: (userId: string) =>
        apiClient.get(`/message/${userId}`),

    sendMessage: (data: { receiver: string; text: string }) =>
        apiClient.post('/message', data),

    // Location/Weather
    getLocationData: (lat: number, lon: number) =>
        apiClient.get(`/location/data?lat=${lat}&lon=${lon}`),

    // Disease Detection
    predictDisease: (formData: FormData) =>
        apiClient.post('/disease/predict', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    // Soil Assessment
    submitQuestionnaire: (data: any) =>
        apiClient.post('/soil-assessment/questionnaire', data),

    // AI Tips
    getCropTips: (data: any) =>
        apiClient.post('/ai/crop-tips', data),

    getFertilizerTips: (data: any) =>
        apiClient.post('/ai/fertilizer-tips', data),

    // Notices
    getNotices: () =>
        apiClient.get('/notices'),
};

// ML Server API (separate from main backend)
const ML_BASE_URL = 'http://192.168.1.64:5000';

export const mlApi = {
    predictCrop: (data: any) =>
        axios.post(`${ML_BASE_URL}/predict_crop`, data),

    predictFertilizer: (data: any) =>
        axios.post(`${ML_BASE_URL}/predict_fertilizer`, data),
};

export default apiClient;
