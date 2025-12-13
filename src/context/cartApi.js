
import axios from "axios";

const CartApi = axios.create({
    baseURL: "https://e-commerce-fitvibe-backend.onrender.com/user/cart",
    withCredentials: true
});

export default CartApi
