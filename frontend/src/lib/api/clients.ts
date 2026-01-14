// src/lib/api/clients.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// No longer need to manually add Authorization header from localStorage
// as HttpOnly cookies are automatically sent by the browser.

export default apiClient;
