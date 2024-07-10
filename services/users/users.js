import axiosInstance from "utils/interceptor";

const headers = {
    'Content-Type': 'application/json'
};

export const logOut = async (data) => {
    try {
        const response = await axiosInstance.post(`auth/logout`, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error evaluating user response:', error);
        throw error;
    }
};