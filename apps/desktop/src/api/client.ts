import axios from 'axios';

// Backend URL (from web app config)
const API_BASE_URL = 'http://localhost:5263';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors by redirecting to login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // In a real router setup, we might want to use navigation hooks, 
            // but strictly for the client, window reload or global event is okay for now.
            // We will handle redirect in AuthContext mostly.
        }
        return Promise.reject(error);
    }
);

export default apiClient;
