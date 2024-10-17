import axiosInstance from '../axios/axiosInstance';
import { createPostRequest, createGetRequest, createPutRequest } from "../axios/apiRequests";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
}

export const signUp = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/auth/register', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
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

export const signIn = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/auth/login', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
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

export const verifyToken = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/auth/verify-token', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
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

export const verifyEmail = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/auth/verify-email', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
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

export const sendEmail = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/auth/send-email', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
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

export const verifyEmailOTP = async (params: any): Promise<ApiResponse<any>> => {
    const getDataConfig = createGetRequest<any>('/auth/verify-email-otp', params);
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

export const forgotPassword = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/auth/forgot-password', body);
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

export const verifyPasswordLink = async (body: any): Promise<ApiResponse<any>> => {
    const postDataConfig = createPostRequest<any>('/auth/verify-password-link', body);
    try {
        // Perform the API request
        const response = await axiosInstance(postDataConfig());
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

export const resetPassword = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/auth/reset-password', body);
    try {
        // Perform the API request
        const response = await axiosInstance(putDataConfig());
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

export const changePassword = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/auth/change-password', body);
    try {
        // Perform the API request
        const response = await axiosInstance(putDataConfig());
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

export const updateProfile = async (body: any): Promise<ApiResponse<any>> => {
    const putDataConfig = createPutRequest<any>('/auth/update-profile', body);
    try {
        // Perform the API request
        const response = await axiosInstance(putDataConfig());
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