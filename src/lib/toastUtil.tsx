import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const showSuccessToast = (message: string) => {
    toast.success(message, defaultOptions);
};

export const showErrorToast = (message: string) => {
    toast.error(message, defaultOptions);
};