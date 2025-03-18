import { configureStore } from '@reduxjs/toolkit'
import residentReducer from "./Slices/ResidentSlice"
import paymentReducer from "./Slices/PaymentSlice"
import AccountingReducer from "./Slices/AccountingSlice"
import accessReducer from "./Slices/AccessSlice"
import surveyReducer from "./Slices/SurveySlice"
import placeReducer from "./Slices/PlaceSlice"
import areaReducer from "./Slices/AreaSlice"
import settingReducer from "./Slices/SettingSlice"
import userManagementReducer from "./Slices/UserManagementSlice"
import authReducer from "./Slices/AuthSlice"
import securityGuardReducer from "./Slices/SecurityGuardSlice"
import expenseReducer from "./Slices/ExpenseSlice"
import { persistStore, persistReducer } from 'redux-persist';
import storage from './storage'

const persistConfig = {
  key: 'auth', // Key for persisting token state
  storage,
}
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
export const store = configureStore({
  reducer: {
    resident: residentReducer,
    payment: paymentReducer,
    accounting: AccountingReducer,
    expense: expenseReducer,
    access: accessReducer,
    survey: surveyReducer,
    place: placeReducer,
    securityGuard: securityGuardReducer,
    area: areaReducer,
    setting: settingReducer,
    userManagement: userManagementReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these specific action types from the serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH', 'persist/PURGE', 'persist/PAUSE', 'persist/RESUME'],
      },
    })
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch