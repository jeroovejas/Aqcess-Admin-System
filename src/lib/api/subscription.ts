import axiosInstance from '../axios/axiosInstance';
import { createGetRequest, createPutRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getUserSubscriptions = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/subscription/user/all', params);
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

export const getUserActiveSubscription = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/subscription/active', params);
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

export const subscriptionCronJob = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/subscription/cron-job', params);
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

export const downGradeSubscription = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/subscription/down-grade', body);
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

export const upGradeSubscription = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/subscription/checkout', body);
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