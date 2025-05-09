import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AuthState {
    token: string;
    userData: any;
    isTokenValid: boolean;
    isFilter: boolean;
    emailModal: boolean;
    packageId: number;
    subscriptionData: any;
}
// Define the initial state
const initialState: AuthState = {
    token: '',
    userData: {},
    isTokenValid: false,
    isFilter: false,
    emailModal: false,
    packageId: 1,
    subscriptionData: {}
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setPackageId: (state, action: PayloadAction<number>) => {
            state.packageId = action.payload;
        },
        setSubscriptionData: (state, action: PayloadAction<any>) => {
            state.subscriptionData = { ...action.payload };
        },
        clearToken: (state) => {
            state.token = '';
        },
        setUserData: (state, action: PayloadAction<any>) => {
            state.userData = action.payload;
        },
        clearUser: (state) => {
            state.userData = {};
        },
        toggleIsTokenValid: (state) => {
            state.isTokenValid = !state.isTokenValid
        },
        toggleIsFilter: (state) => {
            state.isFilter = !state.isFilter
        },
        toggleEmailModal: (state) => {
            state.emailModal = !state.emailModal
        }

    },
});
export const { setToken, clearToken, setUserData, clearUser, toggleIsTokenValid, toggleIsFilter, toggleEmailModal, setPackageId, setSubscriptionData } = authSlice.actions;
export default authSlice.reducer;
