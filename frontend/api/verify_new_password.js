import axios from "axios";

const API_BASE_URL = "http://localhost:8000";  

export const verifyNewPassword = async (verificationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/verify-new-password`, verificationData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Verification failed. Please try again." };
    }
};
