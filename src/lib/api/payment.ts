import axiosInstance from '../axios/axiosInstance';
import { createGetRequest, createPostRequest,createPutRequest,createDeleteRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllTransactions = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/payment/alltransactions', params);
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

export const getAllCards = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/payment/allCards', params);
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

export const getCardDetail = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/payment/CardDetail', params);
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

export const addAdminCard = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/payment/add-admin-card', body);
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

export const editAdminCard = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/payment/edit-admin-card', body);
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

export const deleteCard = async (params: any): Promise<ApiResponse<any>> => {
    const deleteDataConfig = createDeleteRequest<any>('/payment/delete-card', params);
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