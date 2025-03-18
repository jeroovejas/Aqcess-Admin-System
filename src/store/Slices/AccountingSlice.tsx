import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccountingDetails {
    totalIncomeAmount: number;
    totalProductAmount: number;
    totalExpenseAmount: number;
}

interface AccountingState {
    exportModal: boolean;
    viewModal: boolean;
    isUpdated: boolean,
    accountingData: any;
    accountingDetails: AccountingDetails;
}

const initialState: AccountingState = {
    exportModal: false,
    viewModal: false,
    isUpdated: false,
    accountingData: {},
    accountingDetails: {
        totalIncomeAmount: 0,
        totalProductAmount: 0,
        totalExpenseAmount: 0,
    }
};

export const accountingSlice = createSlice({
    name: 'accounting',
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
        setAccountingData: (state, action: PayloadAction<any>) => {
            state.accountingData = { ...state.accountingData, ...action.payload };
        },
        setAccountingDetails: (state, action: PayloadAction<Partial<AccountingDetails>>) => {
            state.accountingDetails = { ...state.accountingDetails, ...action.payload };
        },
        resetAccountingState: (state) => {
            state.exportModal = false;
            state.viewModal = false;
            state.accountingData = {};
            state.accountingDetails = {
                totalIncomeAmount: 0,
                totalProductAmount: 0,
                totalExpenseAmount: 0,
            };
        },
    },
});

export const { 
    toggleExportModal, 
    toggleViewModal,
    toggleIsUpdated,
    setAccountingData, 
    setAccountingDetails, 
    resetAccountingState 
} = accountingSlice.actions;

export default accountingSlice.reducer;
