import axios from 'axios';

// إعداد الكوبري اللي هيكلم الباك إند
const api = axios.create({
  // ⚠️ هنحط هنا اللينك بتاع الباك إند بتاعك
  baseURL: 'https://localhost:7088/api', 
});

export default api;