import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // This points to your Spring Boot port
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging AND attaching JWT token
api.interceptors.request.use(
    config => {
        // NEW: Grab the token from browser storage
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            // If it exists, attach it to the Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
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

// ==========================================
// API ENDPOINTS
// ==========================================

// Phase 2: Auth Endpoints
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Phase 3: Food Item Endpoints (Seller Dashboard)
export const getFoodItems = () => api.get('/food');
export const addFoodItem = (data) => api.post('/food', data);
export const updateFoodItem = (id, foodItem) => api.put(`/food/${id}`, foodItem);
export const deleteFoodItem = (id) => api.delete(`/food/${id}`);

export default api;