import axios from "axios";

const API_BASE_URL = "http://localhost:8000/";

const getuserdata = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}api/users`, {
            "user_id":userId
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
            throw error.response.data;
        } else if (error.request) {
            console.error('Error request:', error.request);
            throw { message: "No response received from server, please try again!" };
        } else {
            console.error('Error message:', error.message);
            throw { message: "Something went wrong, please try again!" };
        }
    }
};

export default getuserdata;