import axiosInstance from '../axios/axiosInstance';
import { createPostRequest, createGetRequest, createPutRequest, createDeleteRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllAreas = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/common-area/all', params);
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

export const getAreaDetails = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/common-area/detail', params);
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

export const createCommonArea = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/common-area/create', body);
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

export const editCommonArea = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/common-area/edit', body);
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
export const changeCommonAreaStatus = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/common-area/change-status', body);
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

export const deleteCommonArea = async (params: any): Promise<ApiResponse<any>> => {
    const deleteDataConfig = createDeleteRequest<any>('common-area/delete-area', params);
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

export const cancelAreaBooking = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/common-area/cancel-booking', body);
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