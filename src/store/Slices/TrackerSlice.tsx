import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrackerDetails {
    totalExpectedAmount: number;
    totalAmountPaid: number;
    remainingAmount: number;
    payableAmountPercentage: number
}

interface TrackerState {
    exportModal: boolean;
    viewModal: boolean;
    isUpdated: boolean,
    trackerData: any;
    trackerDetails: TrackerDetails;
}

const initialState: TrackerState = {
    exportModal: false,
    viewModal: false,
    isUpdated: false,
    trackerData: {},
    trackerDetails: {
        totalExpectedAmount: 0,
        totalAmountPaid: 0,
        remainingAmount: 0,
        payableAmountPercentage: 0,
    }
};

export const trackerSlice = createSlice({
    name: 'tracker',
    initialState,
    reducers: {
        toggleExportModal: (state) => {
            state.exportModal = !state.exportModal;
        },
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setTrackerData: (state, action: PayloadAction<any>) => {
            state.trackerData = { ...state.trackerData, ...action.payload };
        },
        setTrackerDetails: (state, action: PayloadAction<Partial<TrackerDetails>>) => {
            state.trackerDetails = { ...state.trackerDetails, ...action.payload };
        },
        resetTrackerState: (state) => {
            state.exportModal = false;
            state.viewModal = false;
            state.trackerData = {};
            state.trackerDetails = {
                totalExpectedAmount: 0,
                totalAmountPaid: 0,
                remainingAmount: 0,
                payableAmountPercentage: 0,
            };
        },
    },
});

export const {
    toggleExportModal,
    toggleViewModal,
    toggleIsUpdated,
    setTrackerData,
    setTrackerDetails,
    resetTrackerState
} = trackerSlice.actions;

export default trackerSlice.reducer;
