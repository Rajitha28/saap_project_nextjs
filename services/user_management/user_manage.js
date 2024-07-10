import { endpoints } from "constants/endpoint";
import axiosInstance from "utils/interceptor";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const headers = {
    'Content-Type': 'application/json'
};

export const fetchUserManagement = async () => {
    try {
        const response = await axiosInstance.get(endpoints.fetchUserList);
        return response.data;
    } catch (error) {
        console.error('Error fetching result view:', error);
        throw error;
    }
};

export const updateUserRole = async (payload) => {
    try {
        const response = await axiosInstance.put(endpoints.updateUser, payload, { headers });
        return response.data;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

export const listUserRole = async () => {
    try {
        const response = await axiosInstance.get(endpoints.listUser);
        return response.data;
    } catch {
        console.error('Error updating user role:', error);
        throw error;
    }
}