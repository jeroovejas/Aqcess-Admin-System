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
    statusModal: boolean,
    addProduct: boolean,
    duplicateModal: boolean,
    editProduct: boolean,
    isUpdated: boolean,
    productData: any,
    paymentDetails: PaymentDetails;

}

// Define the initial state using that type
const initialState: ProductState = {
    exportModal: false,
    statusModal: false,
    addProduct: false,
    duplicateModal: false,
    editProduct: false,
    isUpdated: false,
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
        toggleAddProduct: (state) => {
            state.addProduct = !state.addProduct;
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
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setPaymentDetails: (state, action: PayloadAction<Partial<PaymentDetails>>) => {
            state.paymentDetails = { ...state.paymentDetails, ...action.payload };
        },
        resetPaymentState: (state) => {
            state.exportModal = false;
        },
        resetProductState: (state) => {
            state.statusModal = false;
            state.addProduct = false;
            state.editProduct = false;
            state.duplicateModal = false;
        },


    },
})

export const { toggleExportModal, toggleAddProduct, setProductData, toggleEditProduct, toggleStatusModal, toggleDuplicateModal, toggleIsUpdated, resetProductState, resetPaymentState, setPaymentDetails } = productSlice.actions
export default productSlice.reducer