import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // il proxy si occuperà del redirect
  withCredentials: true, // se usi cookie/sessione
});

export default api;
