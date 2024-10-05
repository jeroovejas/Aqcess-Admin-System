import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


interface SurveysDetails {
    totalSurveys: number;
    openedSurveys: number;
    averageResponse: number;
}
interface ResidentState {
    reOpenModal: boolean,
    closeSurvey: boolean,
    addModal: boolean,
    editModal: boolean,
    duplicateModal: boolean,
    viewModal: boolean
    surveyData: any,
    isUpdated: boolean,
    surveysDetails: SurveysDetails;
}

// Define the initial state using that type
const initialState: ResidentState = {
    reOpenModal: false,
    closeSurvey: false,
    addModal: false,
    editModal: false,
    duplicateModal: false,
    viewModal: false,
    surveyData: {},
    isUpdated: false,
    surveysDetails: {
        totalSurveys: 0,
        openedSurveys: 0,
        averageResponse: 0,
    }
}

export const surveySlice = createSlice({
    name: 'survey',

    initialState,
    reducers: {
        toggleReOpenModal: (state) => {
            state.reOpenModal = !state.reOpenModal;
        },
        toggleAddModal: (state) => {
            state.addModal = !state.addModal;
        },
        toggleEditModal: (state) => {
            state.editModal = !state.editModal;
        },
        toggleViewModal: (state) => {
            state.viewModal = !state.viewModal;
        },
        setSurveyData: (state, action: PayloadAction<any>) => {
            state.surveyData = { ...action.payload };
        },
        toggleDuplicateModal: (state) => {
            state.duplicateModal = !state.duplicateModal;
        },
        toggleCloseModal: (state) => {
            state.closeSurvey = !state.closeSurvey;
        },
        toggleIsUpdated: (state) => {
            state.isUpdated = !state.isUpdated;
        },
        setSurveysDetails: (state, action: PayloadAction<Partial<SurveysDetails>>) => {
            state.surveysDetails = { ...state.surveysDetails, ...action.payload };
        },
        resetState: (state) => {
            state.reOpenModal = false;
            state.closeSurvey = false;
            state.addModal = false;
            state.editModal = false;
            state.duplicateModal = false;
            state.viewModal = false;
        },
    },
})

export const { toggleReOpenModal, toggleAddModal, setSurveyData, toggleEditModal, toggleViewModal, toggleDuplicateModal, toggleCloseModal, setSurveysDetails, toggleIsUpdated, resetState } = surveySlice.actions
export default surveySlice.reducer