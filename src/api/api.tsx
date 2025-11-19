import axios from 'axios';

const api =axios.create({
    baseURL: 'https://691da739d58e64bf0d36f972.mockapi.io/api',
})

export default {
  // GET запросы
  get: (endpoint, params = {}) => api.get(`/${endpoint}`, { params }),
  
  // POST запросы
  post: (endpoint, data = {}) => api.post(`/${endpoint}`, data),
  
  // PUT запросы (полное обновление)
  put: (endpoint, id, data = {}) => api.put(`/${endpoint}/${id}`, data),
  
  // PATCH запросы (частичное обновление)
  patch: (endpoint, id, data = {}) => api.patch(`/${endpoint}/${id}`, data),
  
  // DELETE запросы
  delete: (endpoint, id) => api.delete(`/${endpoint}/${id}`),
  
  // Получение по ID
  getById: (endpoint, id) => api.get(`/${endpoint}/${id}`)
};