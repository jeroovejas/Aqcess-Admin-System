import axiosInstance from '../axios/axiosInstance';
import { createGetRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllSubscriptions = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/subscription/all', params);
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