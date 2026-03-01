import api from './axios';

export const orderApi = {
    createOrder: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my'),
    getOrderById: (id) => api.get(`/orders/${id}`),
    cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
    // Admin
    getAllOrders: (params) => api.get('/orders', { params }),
    updateStatus: (id, orderStatus) => api.put(`/orders/${id}/status`, { orderStatus }),
    getDashboardStats: () => api.get('/orders/stats'),
    deleteOrder: (id) => api.delete(`/orders/${id}`),
};

export const userApi = {
    getAll: (params) => api.get('/admin/users', { params }),
    toggleBlock: (id) => api.put(`/admin/users/${id}/block`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
