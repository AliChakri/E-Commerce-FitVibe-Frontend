

import axios from 'axios'

const AnalyticsApi = axios.create({
    baseURL: 'https://e-commerce-fitvibe-backend.onrender.com/api/analytics',
    withCredentials: true,
});

axios.defaults.withCredentials = true;

export default AnalyticsApi