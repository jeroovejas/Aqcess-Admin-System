import axiosInstance from '../axios/axiosInstance';
import { createGetRequest, createPostRequest, createPutRequest, createDeleteRequest, createExportRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllExpenses = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/expense/all-expenses', params);
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

export const createExpense = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/expense/create-expense', body);
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

export const deleteExpense = async (params: any): Promise<ApiResponse<any>> => {
    const deleteDataConfig = createDeleteRequest<any>('/expense/delete', params);
    try {
        // Perform the API request
        const response = await axiosInstance(deleteDataConfig());
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

export const exportExpenses = async (params: any): Promise<any> => {
    const getDataConfig = createExportRequest('/expense/export', params);
    try {
        const response = await axiosInstance(getDataConfig);
        return {
            success: true,
            data: response.data.data,
            message: 'File downloaded successfully!'
        }
    } catch (error: any) {
        console.error('Error exporting residents:', error);
        return {
            success: false,
            message: 'Failed to download the file. Please try again.'
        }
    }
};
