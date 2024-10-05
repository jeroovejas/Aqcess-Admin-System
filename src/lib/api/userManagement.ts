import axiosInstance from '../axios/axiosInstance';
import { createPostRequest, createGetRequest, createPutRequest, createDeleteRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const getAllSocietyAdmins = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/user-management/all', params);
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

export const getSocietyAdminDetails = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/user-management/detail', params);
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

export const changeSocietyAdminStatus = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/user-management/change-status', body);
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

export const deleteSocietyAdmin = async (params: any): Promise<ApiResponse<any>> => {
    const deleteDataConfig = createDeleteRequest<any>('/user-management/delete', params);
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