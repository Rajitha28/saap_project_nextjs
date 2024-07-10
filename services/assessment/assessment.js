import axiosInstance from "utils/interceptor";
import { endpoints } from "constants/endpoint";

const headers = {
    'Content-Type': 'application/json'
};

export const getSubject = async () => {
    try {
        const response = await axiosInstance.get(endpoints.getSubject);
        return response.data; // Axios stores response data in `data` property
    } catch (error) {
        console.error('Error fetching subject data:', error);
    }
};

export const getAllQuestionPapers = async () => {
    try {
        const response = await axiosInstance.get(endpoints.getAllQuestionPapers);

        return response.data; // Axios stores response data in `data` property
    } catch (error) {
        console.error('Error fetching question paper data:', error);
        throw error;
    }
};

export const getQuestionPaper = async (id) => {
    try {
        const response = await axiosInstance.get(endpoints.getQuestionPaper, {
            params: { question_paper_id: id }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching question paper data:', error);
        throw error;
    }
};

export const getQuestions = async (questionPaperId, subjectId, examMode) => {
    try {
        const response = await axiosInstance.get(endpoints.getQuestions, {
            params: {
                paper_id: questionPaperId,
                subject_id: subjectId,
                mode: examMode
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching questions data:', error);
        throw error;
    }
};

export const postUserResponse = async (data) => {
    let url = data.user_response.exam_mode == 'exam' ? endpoints.postUserResponseExam : endpoints.postUserResponseInstant;

    try {
        const response = await axiosInstance.post(url, data);

        return response.data;
    } catch (error) {
        console.error('Error posting user response:', error);
        throw error;
    }
};

export const getQuestionPaperById =  async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoints.getQuestionPapersById}=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question paper data:', error);
        throw error;
    }
}