import axios from 'axios';

const UserApi = axios.create({
    baseURL: "https://e-commerce-fitvibe-backend.onrender.com/api/users",
    withCredentials: true
});

export default UserApi;

