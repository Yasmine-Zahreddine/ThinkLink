import axios from "axios";

const API_BASE_URL = "http://localhost:8000";  
export const forgotpassword = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/forgot-password`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Something went wrong, please try again!" };
    }
};
