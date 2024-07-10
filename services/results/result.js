import axiosInstance from "utils/interceptor";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const headers = {
    'Content-Type': 'application/json'
};

export const getResult = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}questions/result/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching result:', error);
        throw error;
    }
};

export const viewResult = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/questions/resultview/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching result view:', error);
        throw error;
    }
};

export const aiInstantModeResponse = async (data) => {
    try {
        const response = await axiosInstance.post(`ai/prompt`, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error evaluating user response:', error);
        throw error;
    }
};

export const aiExamModeResponse = async (userResponseId) => {
    try {
        const response = await axiosInstance.post(`${API_URL}questions/evaluate-user-response/${userResponseId}`, {}, { headers });
        return response.data;
    } catch (error) {
        console.error('Error evaluating user response:', error);
        throw error;
    }
};
