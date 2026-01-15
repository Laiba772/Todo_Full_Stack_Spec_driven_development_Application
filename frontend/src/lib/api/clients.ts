// lib/api/clients.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://laiba67-todo.hf.space/", // Use remote baseURL
  withCredentials: true,           // ← very important for cookies (from remote)
                                   // ← can be useful even with token auth (from my local)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (from my local)
apiClient.interceptors.request.use(
  (config) => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;