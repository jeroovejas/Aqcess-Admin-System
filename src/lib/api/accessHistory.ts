import axiosInstance from '../axios/axiosInstance';
import { createGetRequest, createExportRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAccessHistoryData = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/access-history/all', params);
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

export const exportAccessHistoryData = async (params: any): Promise<any> => {
    const getDataConfig = createExportRequest('/access-history/export', params);
    try {
        // Perform the API request
        const response = await axiosInstance(getDataConfig);
        return {
            success: true,
            data: response.data.data,
            message: 'File downloaded successfully!'
        }
    } catch (error: any) {
        console.error('Error exporting access history data:', error);
        // Return error message
        return {
            success: false,
            message: 'Failed to download the file. Please try again.'
        }
    }
};