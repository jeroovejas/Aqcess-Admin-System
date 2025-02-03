import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ExpenseDetails {
    totalExpenses: number;
    totalIncomes: number;
    expenseThisMonth: number;
}


interface ExpenseState {
    exportModal: boolean,
    addExpense: boolean,
    viewModal: boolean,
    isUpdated: boolean,
    deleteModal: any,
    expenseData: any,
    expenseDetails: ExpenseDetails;

}

// Define the initial state using that type
const initialState: ExpenseState = {
    exportModal: false,
    addExpense: false,
    viewModal: false,
    isUpdated: false,
    deleteModal: false,
    expenseData: {},
    expenseDetails: {
        totalExpenses: 0,
        totalIncomes: 0,
        expenseThisMonth: 0,
    }
}

export const expenseSlice = createSlice({
    name: 'expense',

    initialState,
    reducers: {
        toggleExportModal: (state) => {
            state.exportModal = !state.exportModal;
        },
        toggleAddExpense: (state) => {
            state.addExpense = !state.addExpense;
        },
        toggleDeleteModal: (state) => {
            state.deleteModal = !state.deleteModal;
        },
        setExpenseData: (state, action: PayloadAction<any>) => {
            state.expenseData = { ...state.expenseData, ...action.payload };
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setExpenseDetails: (state, action: PayloadAction<Partial<ExpenseDetails>>) => {
            state.expenseDetails = { ...state.expenseDetails, ...action.payload };
        },
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        resetExpenseState: (state) => {
            state.exportModal = false;
            state.viewModal = false;
            state.deleteModal = false;
            state.addExpense = false;
        },


    },
})

export const { toggleExportModal, toggleAddExpense, toggleDeleteModal, toggleIsUpdated, setExpenseDetails, resetExpenseState, setExpenseData, toggleViewModal, } = expenseSlice.actions
export default expenseSlice.reducer