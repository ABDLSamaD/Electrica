import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5120/api",
  withCredentials: true, // Automatically include cookies in requests
});

export default apiClient;
