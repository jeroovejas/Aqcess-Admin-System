import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface PaymentDetails {
    totalPendingAmount: number;
    painInTime: number;
    paymentThisMonth: number;
}


interface ProductState {
    exportModal: boolean,
    paymentStatusModal: boolean,
    statusModal: boolean,
    addProduct: boolean,
    addPayment: boolean,
    duplicateModal: boolean,
    editProduct: boolean,
    viewModal: boolean,
    isUpdated: boolean,
    productData: any,
    paymentData: any,
    paymentDetails: PaymentDetails;

}

// Define the initial state using that type
const initialState: ProductState = {
    exportModal: false,
    paymentStatusModal: false,
    statusModal: false,
    addProduct: false,
    addPayment: false,
    duplicateModal: false,
    editProduct: false,
    viewModal: false,
    isUpdated: false,
    paymentData: {},
    productData: {},
    paymentDetails: {
        totalPendingAmount: 0,
        painInTime: 0,
        paymentThisMonth: 0,
    }
}

export const productSlice = createSlice({
    name: 'payment',

    initialState,
    reducers: {
        toggleExportModal: (state) => {
            state.exportModal = !state.exportModal;
        },
        togglePaymentStatusModal: (state) => {
            state.paymentStatusModal = !state.paymentStatusModal;
        },
        toggleAddProduct: (state) => {
            state.addProduct = !state.addProduct;
        },
        toggleAddPayment: (state) => {
            state.addPayment = !state.addPayment;
        },
        toggleEditProduct: (state) => {
            state.editProduct = !state.editProduct;
        },
        toggleStatusModal: (state) => {
            state.statusModal = !state.statusModal;
        },
        toggleDuplicateModal: (state) => {
            state.duplicateModal = !state.duplicateModal;
        },
        setProductData: (state, action: PayloadAction<any>) => {
            state.productData = { ...state.productData, ...action.payload };
        },
        setPaymentData: (state, action: PayloadAction<any>) => {
            state.paymentData = { ...state.paymentData, ...action.payload };
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setPaymentDetails: (state, action: PayloadAction<Partial<PaymentDetails>>) => {
            state.paymentDetails = { ...state.paymentDetails, ...action.payload };
        },
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        resetPaymentState: (state) => {
            state.exportModal = false;
            state.viewModal = false;
            state.paymentStatusModal = false;
            state.addPayment = false;
        },
        resetProductState: (state) => {
            state.statusModal = false;
            state.addProduct = false;
            state.editProduct = false;
            state.duplicateModal = false;
        },


    },
})

export const { toggleExportModal, toggleAddProduct, setProductData, toggleEditProduct, toggleStatusModal, toggleDuplicateModal, toggleIsUpdated, resetProductState, resetPaymentState, setPaymentDetails, toggleAddPayment, setPaymentData, toggleViewModal,togglePaymentStatusModal } = productSlice.actions
export default productSlice.reducer