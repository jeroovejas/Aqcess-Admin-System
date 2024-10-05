import axiosInstance from '../axios/axiosInstance';
import { createPostRequest, createGetRequest, createPutRequest, createDeleteRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllSurveys = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/survey/all', params);
    try {
        // Perform the API request
        const response = await axiosInstance(getDataConfig());
        return {
            success: true,
            data: response.data,  //response.data contains our backend API response
        };
    } catch (error: any) {
        const errorResponse = error.response || {};
        return {
            success: false,
            data: errorResponse.data,
        };
    }
};

export const createSurvey = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/survey/create', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorResponse = error.response || {};
        return {
            success: false,
            data: errorResponse.data,
        };
    }
};

export const editSurvey = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/survey/edit', body);
    try {
        // Perform the API request
        const response = await axiosInstance(putDataConfig());
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorResponse = error.response || {};
        return {
            success: false,
            data: errorResponse.data,
        };
    }
};

export const closeSurveyApi = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/survey/close-survey', body);
    try {
        // Perform the API request
        const response = await axiosInstance(putDataConfig());
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorResponse = error.response || {};
        return {
            success: false,
            data: errorResponse.data,
        };
    }
};

export const duplicateSurvey = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/survey/duplicate-survey', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorResponse = error.response || {};
        return {
            success: false,
            data: errorResponse.data,
        };
    }
};

export const reOpenSurvey = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/survey/reopen-survey', body);
    try {
        // Perform the API request
        const response = await axiosInstance(putDataConfig());
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        const errorResponse = error.response || {};
        return {
            success: false,
            data: errorResponse.data,
        };
    }
};