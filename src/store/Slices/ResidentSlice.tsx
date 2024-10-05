import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface ResidentDetails {
    totalResidents: number;
    activeResidents: number;
    overdueResidents: number;
}

interface ResidentState {
    exportModal: boolean,
    addModal: boolean,
    editModal: boolean,
    saveModal: boolean,
    statusModal: boolean,
    deleteModal: boolean,
    viewModal: boolean,
    isUpdated: boolean,
    residentData: any,
    residentDetails: ResidentDetails;
}

// Define the initial state using that type
const initialState: ResidentState = {
    exportModal: false,
    addModal: false,
    editModal: false,
    saveModal: false,
    deleteModal: false,
    statusModal: false,
    viewModal: false,
    isUpdated: false,
    residentData: {},
    residentDetails: {
        totalResidents: 0,
        activeResidents: 0,
        overdueResidents: 0
    },
}

export const residentSlice = createSlice({
    name: 'resident',

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
        setResidentData: (state, action: PayloadAction<any>) => {
            state.residentData = { ...action.payload };
        },
        toggleStatusModal: (state) => {
            state.statusModal = !state.statusModal;
        },
        setResidentDetails: (state, action: PayloadAction<Partial<ResidentDetails>>) => {
            state.residentDetails = { ...state.residentDetails, ...action.payload };
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

export const { toggleExportModal, toggleAddModal, toggleEditModal, toggleSaveModal, toggleDeleteModal, setResidentData, toggleViewModal, toggleStatusModal, toggleIsUpdated, setResidentDetails,resetState } = residentSlice.actions
export default residentSlice.reducer