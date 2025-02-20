import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api";

export const getChatResponse = async (questionType, videoId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/video-player-chat`, {
            type: questionType,
            video_id: videoId
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to get response" };
    }
};