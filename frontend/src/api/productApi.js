import api from './axios';

export const productApi = {
    getProducts: (params) => api.get('/products', { params }),
    getFeatured: () => api.get('/products/featured'),
    getById: (id) => api.get(`/products/${id}`),
    getLowStock: () => api.get('/products/admin/low-stock'),
    create: (formData) =>
        api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) =>
        api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => api.delete(`/products/${id}`),
    deleteImage: (id, public_id) => api.delete(`/products/${id}/images/${public_id}`),
    rate: (id, data) => api.post(`/products/${id}/ratings`, data),
};
