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
    if (token) {
        config.headers['x-cokis'] = token;
    }
    return config;
});

export default api;