import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


interface ResidentState {
    addModal: boolean,
    editModal: boolean,
    assignModal: boolean,
    viewModal: boolean
    placeData: any,
    isUpdated: boolean,
}

// Define the initial state using that type
const initialState: ResidentState = {
    addModal: false,
    editModal: false,
    assignModal: false,
    viewModal: false,
    placeData: {},
    isUpdated: false,
}

export const placeSlice = createSlice({
    name: 'place',

    initialState,
    reducers: {
        toggleAddModal: (state) => {
            state.addModal = !state.addModal;
        },
        toggleEditModal: (state) => {
            state.editModal = !state.editModal;
        },
        toggleAssignModal: (state) => {
            state.assignModal = !state.assignModal;
        },
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        setPlaceData: (state, action: PayloadAction<any>) => {
            state.placeData = { ...action.payload };
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        resetState: (state) => {
            state.addModal = false;
            state.editModal = false;
            state.assignModal = false;
            state.viewModal = false;
        },
    },
})

export const { toggleAddModal, setPlaceData, toggleEditModal, toggleAssignModal, toggleViewModal, toggleIsUpdated, resetState } = placeSlice.actions
export default placeSlice.reducer