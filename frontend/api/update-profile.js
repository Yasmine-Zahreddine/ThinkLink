import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/";

export const updateUserProfile = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}update-profile`, userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data);
            throw error.response.data;
        } else if (error.request) {
            console.error("Error request:", error.request);
            throw { message: "No response received from server, please try again!" };
        } else {
            console.error("Error message:", error.message);
            throw { message: "Something went wrong, please try again!" };
        }
    }
};
