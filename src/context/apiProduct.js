
import axios from 'axios'

const API = axios.create({
    baseURL: 'https://e-commerce-fitvibe-backend.onrender.com/api/products',
    withCredentials: true,
});

export default API
