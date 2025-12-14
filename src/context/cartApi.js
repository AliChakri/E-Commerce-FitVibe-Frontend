
import axios from "axios";

const CartApi = axios.create({
    baseURL: "https://e-commerce-fitvibe-backend.onrender.com/api/cart",
    withCredentials: true
});

export default CartApi
