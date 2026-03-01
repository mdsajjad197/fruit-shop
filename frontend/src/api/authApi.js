import api from './axios';

export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    addAddress: (data) => api.post('/auth/addresses', data),
    updateAddress: (id, data) => api.put(`/auth/addresses/${id}`, data),
    deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};
