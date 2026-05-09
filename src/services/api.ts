import axios from "axios";

const API = axios.create({
  baseURL: "http://10.146.210.6:5000/api", // 🔥 replace with your IP
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = token;
  }
  return req;
});

export default API;