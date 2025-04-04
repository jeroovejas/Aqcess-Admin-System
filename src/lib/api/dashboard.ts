import axiosInstance from '../axios/axiosInstance';
import { createGetRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getDashboardData = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/dashboard/get-data', params);
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

export const getDashboardChartPayment = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/dashboard/chart-stats', params);
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