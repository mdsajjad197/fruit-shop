import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const feedbackApi = {
    // User submits feedback
    submitFeedback: async (feedbackData) => {
        const response = await api.post('/feedback', feedbackData);
        return response.data;
    },

    // Admin views feedback
    getFeedbackAdmin: async () => {
        const response = await api.get('/feedback');
        return response.data;
    },

    // Admin marks feedback read
    markFeedbackReadAdmin: async (id) => {
        const response = await api.put(`/feedback/${id}/read`);
        return response.data;
    },

    // Admin deletes feedback
    deleteFeedbackAdmin: async (id) => {
        const response = await api.delete(`/feedback/${id}`);
        return response.data;
    }
};
