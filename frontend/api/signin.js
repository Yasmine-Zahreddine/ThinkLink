import axios from "axios";

const API_BASE_URL = "http://localhost:8000";  

export const signin = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/signin`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Something went wrong, please try again!" };
    }
}; 