import axios from 'axios';

const API_URL = "https://voltms.com/wp-json"; // Replace with your actual site URL

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to log in and get JWT token
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/jwt-auth/v1/token', {
      username,
      password,
    });
    console.log("Response data: ", response.data);
    return response.data; // Contains the JWT token
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to verify the token and get user details
export const fetchUserData = async (token) => {
  try {
    console.time('fetchUserData');
    const response = await api.get('/wp/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.timeEnd('fetchUserData');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout function (clears localStorage)
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Add request interceptor to handle errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);
