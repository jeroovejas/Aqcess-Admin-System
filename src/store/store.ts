import { configureStore } from '@reduxjs/toolkit'
import residentReducer from "./Slices/ResidentSlice"
import paymentReducer from "./Slices/PaymentSlice"
import accessReducer from "./Slices/AccessSlice"
import surveyReducer from "./Slices/SurveySlice"
import placeReducer from "./Slices/PlaceSlice"
import areaReducer from "./Slices/AreaSlice"
import settingReducer from "./Slices/SettingSlice"
import userManagementReducer from "./Slices/UserManagementSlice"
import authReducer from "./Slices/AuthSlice"
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
    access: accessReducer,
    survey: surveyReducer,
    place: placeReducer,
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch