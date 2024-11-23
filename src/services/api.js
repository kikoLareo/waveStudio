import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.183:8000', 
});

export default api;