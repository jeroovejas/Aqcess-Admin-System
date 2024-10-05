import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface AccessState {
    exportModal: boolean,

}

// Define the initial state using that type
const initialState: AccessState = {
    exportModal: false
}


export const accessSlice = createSlice({
    name: 'access',

    initialState,
    reducers: {
        toggleExportModal: (state) => {
            state.exportModal = !state.exportModal;
        },
        resetState: (state) => {
            state.exportModal = false
        }

    },
})

export const { toggleExportModal,resetState } = accessSlice.actions
export default accessSlice.reducer