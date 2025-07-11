import axios from "axios";

const API = axios.create({
  baseURL: " https://localhost:7288/api", // change if using another port
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;
