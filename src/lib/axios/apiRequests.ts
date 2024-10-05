import { AxiosRequestConfig } from 'axios';

// Utility function for GET requests
export const createGetRequest = <T>(path: string, params?: Record<string, any>, config?: AxiosRequestConfig): (() => AxiosRequestConfig) => {
    return () => {
        // Create the request configuration
        const requestConfig: AxiosRequestConfig = {
            url: path,
            method: 'get',
            params,
            ...config,
        };
        // Return the configuration
        return requestConfig;
    };
};

// Utility function for POST requests
export const createPostRequest = <T>(path: string, data: any, config?: AxiosRequestConfig): (() => AxiosRequestConfig) => {
    return () => {
        // Create the request configuration
        const requestConfig: AxiosRequestConfig = {
            url: path,
            method: 'post',
            data,
            ...config,
        };

        // Return the configuration
        return requestConfig;
    };
};

// Utility function for PUT requests
export const createPutRequest = <T>(path: string, data: any, config?: AxiosRequestConfig): (() => AxiosRequestConfig) => {
    return () => {
        // Create the request configuration
        const requestConfig: AxiosRequestConfig = {
            url: path,
            method: 'put',
            data,
            ...config,
        };

        // Return the configuration
        return requestConfig;
    };
};

// Utility function for DELETE requests

export const createDeleteRequest = <T>(path: string, params?: Record<string, any>, config?: AxiosRequestConfig): (() => AxiosRequestConfig) => {
    return () => {
        // Create the request configuration
        const requestConfig: AxiosRequestConfig = {
            url: path,
            method: 'delete',
            params, // Use params to include data as query parameters
            ...config,
        };

        // Return the configuration
        return requestConfig;
    };
};
