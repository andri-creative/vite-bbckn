import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    config.headers['x-timestamp'] = Date.now().toString();
    
    const token = localStorage.getItem('x-cokis');
    const authDate = localStorage.getItem('auth-date');
    const currentDate = new Date().toDateString();
    
    if (token) {
        if (!authDate) {
            localStorage.setItem('auth-date', currentDate);
        } else if (authDate !== currentDate) {
            // Day changed, logout
            localStorage.removeItem('x-cokis');
            localStorage.removeItem('user');
            localStorage.removeItem('auth-date');
            
            // Redirect to login page
            window.location.href = '/admin/sign-in';
            return Promise.reject(new Error("Session expired due to day change."));
        }
        config.headers['x-cokis'] = token;
    }
    return config;
});

export default api;