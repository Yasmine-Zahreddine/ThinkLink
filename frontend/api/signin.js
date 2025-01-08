import axios from "axios";

// Define the API base URL
const API_BASE_URL = "http://localhost:8000";  // Ensure the URL is correct

export const signin = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/signin`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
}; 