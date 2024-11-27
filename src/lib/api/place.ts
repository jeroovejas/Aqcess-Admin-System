import axiosInstance from '../axios/axiosInstance';
import { createPostRequest, createGetRequest, createPutRequest, createDeleteRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllPlaces = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/place/all', params);
    try {
        const response = await axiosInstance(getDataConfig());
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
export const getPlace = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>(`/place/detail?id=${params}`);
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

export const createPlace = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/place/create-place', body);
    try {
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

export const assignPlace = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/place/assign-place', body);
    try {
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

export const editPlace = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPostRequest<any>('/place/edit-place', body);
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