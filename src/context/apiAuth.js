// context/apiAuth.js

import axios from 'axios';

const AuthApi = axios.create({
  baseURL: 'https://e-commerce-fitvibe-backend.onrender.com/api/auth',
  withCredentials: true, // Important: sends cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});


export default AuthApi;