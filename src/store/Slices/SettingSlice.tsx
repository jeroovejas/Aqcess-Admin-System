import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface SettingState {
    billingModal: boolean,
    addMethod: boolean,
    editMethod: boolean,
    deleteModal: boolean,
    isUpdated: boolean,
    cardData: any,

}

// Define the initial state using that type
const initialState: SettingState = {
    billingModal: false,
    addMethod: false,
    editMethod: false,
    deleteModal: false,
    isUpdated: false,
    cardData: {},
}


export const settingSlice = createSlice({
    name: 'setting',

    initialState,
    reducers: {
        toggleBillingModal: (state) => {
            state.billingModal = !state.billingModal;
        },
        toggleAddMethodModal: (state) => {
            state.addMethod = !state.addMethod;
        },
        toggleEditMethodModal: (state) => {
            state.editMethod = !state.editMethod;
        },
        toggleDeleteModal: (state) => {
            state.deleteModal = !state.deleteModal;
        },
        setCardData: (state, action: PayloadAction<any>) => {
            state.cardData = { ...state.cardData, ...action.payload };
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        resetState: (state) => {
            state.billingModal = false;
            state.addMethod = false;
            state.editMethod = false;
            state.deleteModal = false;
        },

    },
})

export const { toggleBillingModal, toggleAddMethodModal, setCardData, toggleEditMethodModal, toggleDeleteModal, resetState, toggleIsUpdated } = settingSlice.actions
export default settingSlice.reducer