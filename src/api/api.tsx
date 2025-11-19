import axios from "axios";

const API_BASE = "https://691da739d58e64bf0d36f972.mockapi.io/"; // ← поставь свой URL

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// GET
export const apiGet = (endpoint: string) => {
  return api.get(endpoint);
};

// POST
export const apiPost = (endpoint: string, data: any) => {
  return api.post(endpoint, data);
};

// PUT
export const apiPut = (endpoint: string, id: string, data: any) => {
  return api.put(`${endpoint}/${id}`, data);
};

// DELETE
export const apiDelete = (endpoint: string, id: string) => {
  return api.delete(`${endpoint}/${id}`);
};

export default api;
