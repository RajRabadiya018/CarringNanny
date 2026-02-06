import axios from 'axios';

// Set base URL for all axios requests
//axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.baseURL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Clear any existing interceptors
if (axios.interceptors.request.handlers) {
  axios.interceptors.request.handlers = [];
}

// Interceptor to add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo && userInfo.token) {
          console.log(`Adding auth token to ${config.method.toUpperCase()} ${config.url}`);
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      } catch (err) {
        console.error('Error parsing userInfo from localStorage:', err);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request - you may need to log in again');
      // Optional: Redirect to login or clear stored data
      // localStorage.removeItem('userInfo');
      // window.location.href = '/login';
    }
    
    // Log errors with API endpoints for debugging
    if (error.response) {
      console.error(`API Error (${error.response.status}):`, error.config.url, error.response.data);
    } else if (error.request) {
      console.error('No response received from API:', error.config.url);
    } else {
      console.error('Error in request setup:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axios;
