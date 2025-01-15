import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5120", // Your backend URL
  withCredentials: true,
});

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Silently handle 401 Unauthorized errors
      return Promise.resolve({ data: { isAuthenticated: false } });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
