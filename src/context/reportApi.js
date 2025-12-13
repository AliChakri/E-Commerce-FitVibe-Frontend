

import axios from 'axios'

const ReportApi = axios.create({
    baseURL: 'https://e-commerce-fitvibe-backend.onrender.com/api/report',
    withCredentials: true,
});

axios.defaults.withCredentials = true;

export default ReportApi