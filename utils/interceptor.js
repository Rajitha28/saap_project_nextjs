"use client"
import axios from 'axios';
import { signOut } from 'next-auth/react';

// Create an instance of axios with custom configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
 
// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Get the token from wherever it's stored (localStorage, cookies, etc.)
    const token = localStorage.getItem('access_token');
 
    // If a token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
 
    return config;
  },
  function (error) {

    return Promise.reject(error);
  }
);


// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      localStorage.clear()
      signOut();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;