import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface SecurityGuardDetails {
    totalSecurityGuards: number;
    activeSecurityGuards: number;
}

interface SecurityGuardState {
    exportModal: boolean,
    addModal: boolean,
    editModal: boolean,
    saveModal: boolean,
    statusModal: boolean,
    deleteModal: boolean,
    viewModal: boolean,
    isUpdated: boolean,
    securityGuardData: any,
    securityGuardDetails: SecurityGuardDetails;
}

// Define the initial state using that type
const initialState: SecurityGuardState = {
    exportModal: false,
    addModal: false,
    editModal: false,
    saveModal: false,
    deleteModal: false,
    statusModal: false,
    viewModal: false,
    isUpdated: false,
    securityGuardData: {},
    securityGuardDetails: {
        totalSecurityGuards: 0,
        activeSecurityGuards: 0,
    },
}

export const securityGuardSlice = createSlice({
    name: 'securityGuard',

    initialState,
    reducers: {
        toggleExportModal: (state) => {
            state.exportModal = !state.exportModal;
        },
        toggleAddModal: (state) => {
            state.addModal = !state.addModal;
        },
        toggleEditModal: (state) => {
            state.editModal = !state.editModal;
        },
        toggleSaveModal: (state) => {
            state.saveModal = !state.saveModal;
        },
        toggleDeleteModal: (state) => {
            state.deleteModal = !state.deleteModal;
        },
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setSecurityGuardData: (state, action: PayloadAction<any>) => {
            state.securityGuardData = { ...action.payload };
        },
        toggleStatusModal: (state) => {
            state.statusModal = !state.statusModal;
        },
        setSecurityGuardDetails: (state, action: PayloadAction<Partial<SecurityGuardDetails>>) => {
            state.securityGuardDetails = { ...state.securityGuardDetails, ...action.payload };
        },
        resetState: (state) => {
            state.exportModal = false;
            state.addModal = false;
            state.editModal = false;
            state.saveModal = false;
            state.deleteModal = false;
            state.statusModal = false;
            state.viewModal = false;
        },

    },
})

export const { toggleExportModal, toggleAddModal, toggleEditModal, toggleSaveModal, toggleDeleteModal, setSecurityGuardData, toggleViewModal, toggleStatusModal, toggleIsUpdated, setSecurityGuardDetails, resetState } = securityGuardSlice.actions
export default securityGuardSlice.reducer