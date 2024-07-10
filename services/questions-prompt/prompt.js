import axiosInstance from "utils/interceptor";
import { endpoints } from "constants/endpoint";

/**
 * The function `getAllEssayQuestions` fetches essay questions based on the provided paper ID and
 * subject ID.
 * @param paperId - Paper ID is the unique identifier for a specific exam paper or test paper. It helps
 * in identifying the set of questions related to that particular paper.
 * @param subjectId - The `subjectId` parameter in the `getAllEssayQuestions` function represents the
 * unique identifier of the subject for which you want to retrieve essay questions. It is used to
 * specify the subject for which the essay questions should be fetched from the API.
 * @returns The function `getAllEssayQuestions` is returning the result of the API call in JSON format.
 */

export const getAllEssayQuestions = async (paperId, subjectId) => {
    try {
        const response = await axiosInstance.get(endpoints.getEssayQuestions, {
            params: {
                paper_id: paperId,
                subject_id: subjectId,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching essay questions:', error);
        throw error;
    }
};



/**
 * The function `savePrompt` sends a POST request to a specified API endpoint to save prompt data and
 * returns the response in JSON format.
 * @param data - The `data` parameter in the `savePrompt` function is the information that you want to
 * save or send to the API endpoint. It should be an object containing the necessary data that needs to
 * be sent in the request body as JSON. This data could include any relevant information needed for
 * saving the prompt
 * @returns The savePrompt function returns a Promise that resolves to the JSON response from the API
 * after saving the prompt data.
 */

export const savePrompt = async (data) => {
    try {
        const response = await axiosInstance.post(endpoints.aiPrompt, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to save Prompt');
        }

        return response.data;
    } catch (error) {
        console.error('Error saving Prompt:', error);
        throw error;
    }
};

/**
 * The function `updatePrompt` sends a PUT request to a specified API endpoint to update a prompt with
 * the provided data.
 * @param data - The `data` parameter in the `updatePrompt` function is an object that contains the
 * information needed to update a prompt. This data will be converted to a JSON string using
 * `JSON.stringify(data)` before sending it in the request body to the specified API endpoint for
 * updating the prompt.
 * @returns The `updatePrompt` function is returning the JSON response from the API after updating the
 * prompt data.
 */

export const updatePrompt = async (data) => {
    try {
        const response = await axiosInstance.put(endpoints.updatePrompt, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating Prompt:', error);
        throw error;
    }
};