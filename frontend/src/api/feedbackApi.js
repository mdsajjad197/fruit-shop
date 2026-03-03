import api from './axios';

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
