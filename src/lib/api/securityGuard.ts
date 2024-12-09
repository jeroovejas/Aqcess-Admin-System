import axiosInstance from '../axios/axiosInstance';
import { createPostRequest, createGetRequest, createPutRequest, createDeleteRequest, createExportRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllSecurityGuards = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/security-guard/all', params);
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

export const exportSecurityGuards = async (params: any): Promise<any> => {
    const getDataConfig = createExportRequest('/security-guard/export', params);
    try {
        // Perform the API request
        const response = await axiosInstance(getDataConfig);
        return {
            success: true,
            data: response.data.data,
            message: 'File downloaded successfully!'
        }
    } catch (error: any) {
        console.error('Error exporting residents:', error);
        // Return error message
        return {
            success: false,
            message: 'Failed to download the file. Please try again.'
        }
    }
};

export const createSecurityGuard = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/security-guard/create', body);
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

export const editSecurityGuard = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/security-guard/edit', body);
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

export const changeSecurityGuardStatus = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/security-guard/change-status', body);
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

export const deleteSecurityGuard = async (params: any): Promise<ApiResponse<any>> => {
    const deleteDataConfig = createDeleteRequest<any>('/security-guard/delete', params);
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