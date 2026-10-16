import axios from 'axios'

// In development Vite proxies /api to the Express server (see vite.config.js);
// in production Express serves both the API and the built frontend.
const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true // send cookies to the server
})

export default axiosInstance
