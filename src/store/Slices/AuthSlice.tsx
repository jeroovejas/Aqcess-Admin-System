import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AuthState {
    token: string;
    userData: any;
    isTokenValid: boolean,
    isFilter: boolean
}
// Define the initial state
const initialState: AuthState = {
    token: '',
    userData: {},
    isTokenValid: false,
    isFilter: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
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
        }
        
    },
});
export const { setToken, clearToken, setUserData, clearUser, toggleIsTokenValid,toggleIsFilter } = authSlice.actions;
export default authSlice.reducer;
