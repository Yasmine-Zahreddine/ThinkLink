// src/api/signup.js
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; 

export const signup = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
};
