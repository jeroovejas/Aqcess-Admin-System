import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface AreaDetails {
    totalActiveBookings: number;
    uniqueBookers: number;
    percentageBookedForNextDay: number;
    percentageBookedForNext7Days: number;
}

interface AreaState {
    addModal: boolean,
    editModal: boolean,
    viewModal: boolean,
    bookingModal: boolean,
    deleteModal: boolean,
    statusModal: boolean,
    isUpdated: boolean,
    areaData: any,
    bookingId: number,
    areaDetails: AreaDetails;

}

// Define the initial state using that type
const initialState: AreaState = {
    addModal: false,
    editModal: false,
    viewModal: false,
    bookingModal: false,
    statusModal: false,
    deleteModal: false,
    isUpdated: false,
    areaData: {},
    bookingId: 0,
    areaDetails: {
        totalActiveBookings: 0,
        uniqueBookers: 0,
        percentageBookedForNextDay: 0,
        percentageBookedForNext7Days: 0
    },
}


export const areaSlice = createSlice({
    name: 'area',
    initialState,
    reducers: {
        toggleAddModal: (state) => {
            state.addModal = !state.addModal;
        },
        toggleEditModal: (state) => {
            state.editModal = !state.editModal;
        },
        toggleDeleteModal: (state) => {
            state.deleteModal = !state.deleteModal;
        },
        toggleStatusModal: (state) => {
            state.statusModal = !state.statusModal;
        },
        toggleBookingModal: (state) => {
            state.bookingModal = !state.bookingModal;
        },
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setAreaData: (state, action: PayloadAction<any>) => {
            state.areaData = { ...action.payload };
        },
        setBookingId: (state, action: PayloadAction<any>) => {
            state.bookingId = action.payload;
        },
        setAreaDetails: (state, action: PayloadAction<Partial<AreaDetails>>) => {
            state.areaDetails = { ...state.areaDetails, ...action.payload };
        },
        resetState: (state) => {
            state.addModal = false;
            state.editModal = false;
            state.deleteModal = false;
            state.viewModal = false;
            state.statusModal = false;
        },

    },
})

export const { toggleAddModal, toggleDeleteModal, setAreaData, toggleStatusModal, toggleEditModal, toggleViewModal, toggleBookingModal, toggleIsUpdated, setAreaDetails, setBookingId, resetState } = areaSlice.actions
export default areaSlice.reducer