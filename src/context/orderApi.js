

import axios from "axios";

const OrderApi = axios.create({
    baseURL: "https://e-commerce-fitvibe-backend.onrender.com/api/order",
    withCredentials: true
});

export default OrderApi
