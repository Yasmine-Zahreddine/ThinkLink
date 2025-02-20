import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/";


export const getChatResponse = async (message, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/chat-bot`, {
            message,
            user_id: userId
        });
        return response;
    } catch (error) {
        throw error.response?.data || { message: "Failed to get response" };
    }
};
