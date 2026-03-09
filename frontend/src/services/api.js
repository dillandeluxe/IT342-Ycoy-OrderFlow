import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // This points to your Spring Boot port
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging
api.interceptors.request.use(
    config => {
        console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    error => {
        console.error('API Response Error:', error);
        return Promise.reject(error);
    }
);

export default api;