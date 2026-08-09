import axios from "axios";

// Guarded baseURL: if the Vite env var is missing or equals the string 'undefined',
// do not set a baseURL so relative requests (e.g. `/api/...`) use the current origin.
const envUrl = import.meta.env.VITE_ELECTRICA_API_URL;
const baseURL = envUrl && envUrl !== "undefined" ? envUrl : "";

if (baseURL) {
  axios.defaults.baseURL = baseURL;
}

axios.defaults.withCredentials = true;

// Add request interceptor for optional cache-busting when a flag is set.
axios.interceptors.request.use(
  (config) => {
    try {
      const invalidate = localStorage.getItem("invalidateCache");
      if (invalidate && config && config.method === "get") {
        config.params = { ...(config.params || {}), _cb: invalidate };
        localStorage.removeItem("invalidateCache");
      }
    } catch (e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
