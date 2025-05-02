import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface SubscriptionDetails {
    totalSubscriptions: number;
    freeSubscriptions: number;
    paidSubscriptions: number;
    totalAmount: number;
}

interface ResidentState {
    viewModal: boolean,
    isUpdated: boolean,
    subscriptionData: any,
    subscriptionDetails: SubscriptionDetails;
}

// Define the initial state using that type
const initialState: ResidentState = {
    viewModal: false,
    isUpdated: false,
    subscriptionData: {},
    subscriptionDetails: {
        totalSubscriptions: 0,
        freeSubscriptions: 0,
        paidSubscriptions: 0,
        totalAmount: 0
    },
}

export const subscriptionSlice = createSlice({
    name: 'subscription',

    initialState,
    reducers: {
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setSubscriptionData: (state, action: PayloadAction<any>) => {
            state.subscriptionData = { ...action.payload };
        },
        setSubscriptionDetails: (state, action: PayloadAction<Partial<SubscriptionDetails>>) => {
            state.subscriptionDetails = { ...state.subscriptionDetails, ...action.payload };
        },
        resetState: (state) => {
            state.viewModal = false;
        },

    },
})

export const { setSubscriptionDetails, toggleViewModal, toggleIsUpdated, setSubscriptionData, resetState } = subscriptionSlice.actions
export default subscriptionSlice.reducer