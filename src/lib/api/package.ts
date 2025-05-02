import axiosInstance from '../axios/axiosInstance';
import { createGetRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getPackageDetail = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/package/detail', params);
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

export const getAllPackages = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/package/all', params);
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