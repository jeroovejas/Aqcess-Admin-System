import axiosInstance from '../axios/axiosInstance';
import { createPostRequest, createGetRequest, createPutRequest, createDeleteRequest, createExportRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllResidents = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/residents/all', params);
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

export const exportResidents = async (params: any): Promise<any> => {
    const getDataConfig = createExportRequest('/residents/export', params);
    try {
        // Perform the API request
        const response = await axiosInstance(getDataConfig);

        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'residents.csv'); // Specify the file name

        // Append to the body to make it work in Firefox
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        if (link.parentNode) {
            link.parentNode.removeChild(link); // Safely remove the link
        }

        return {
            success: true,
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

export const createResident = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/residents/create', body);
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

export const editResident = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/residents/edit', body);
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

export const changeResidentStatus = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/residents/change-status', body);
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

export const deleteResident = async (params: any): Promise<ApiResponse<any>> => {
    const deleteDataConfig = createDeleteRequest<any>('/residents/delete', params);
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