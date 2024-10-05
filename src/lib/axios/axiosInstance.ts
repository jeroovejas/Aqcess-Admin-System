import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 10000,
});

axiosInstance.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;