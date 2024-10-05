import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface userManagementState {
    statusModal: boolean,
    isUpdated: boolean,
    deleteModal:boolean,
    adminData: any,

}

// Define the initial state using that type
const initialState: userManagementState = {
    statusModal: false,
    deleteModal:false,
    isUpdated: false,
    adminData: {}
}


export const userManagementSlice = createSlice({
    name: 'userManagement',

    initialState,
    reducers: {
        toggleStatusModal: (state) => {
            state.statusModal = !state.statusModal;
        },
        toggleDeleteModal: (state) => {
            state.deleteModal = !state.deleteModal;
        },
        resetState: (state) => {
            state.statusModal = false;
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setAdminData: (state, action: PayloadAction<any>) => {
            state.adminData = { ...action.payload };
        },

    },
})

export const { toggleStatusModal, resetState, toggleIsUpdated, setAdminData,toggleDeleteModal } = userManagementSlice.actions
export default userManagementSlice.reducer