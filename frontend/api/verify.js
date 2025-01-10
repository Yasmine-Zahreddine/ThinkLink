import axios from "axios";

const API_BASE_URL = "http://localhost:8000";  

export const verifyCode = async (verificationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/verify-signup`, verificationData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Verification failed. Please try again." };
    }
};
