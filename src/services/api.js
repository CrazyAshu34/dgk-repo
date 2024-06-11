import axios from 'axios';
import localStorageAvailable from '../utils/localStorageAvailable';
// const api = axios.create();

const storageAvailable = localStorageAvailable();
const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
const BASE_URL = process.env.REACT_APP_HOST_API_KEY;
// const BASE_URL = 'https://api.tasarika.com/api/v1';
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(config => {
  // const accessToken = 'your-access-token';
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export default api;
