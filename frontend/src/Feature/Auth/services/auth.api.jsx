import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/user",
  withCredentials: true,
});

export async function login(username, email, password) {
  const response = await api.post("/login", {
    username,
    email,
    password,
  });

  return response.data;
}

export async function register(username, email, password) {
  const response = await api.post("/register", {
    username,
    email,
    password,
  });

  return response.data;
}
