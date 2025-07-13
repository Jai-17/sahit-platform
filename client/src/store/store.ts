import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './features/NavigationSlice';
import { apiSlice } from './features/apiSlice';
import { protectedApiSlice } from './features/protectedApiSlice';
import authReducer from './features/authSlice';

export const store = () => {
    return configureStore({
        reducer: {
            navigation: navigationReducer,
            auth: authReducer,
            [apiSlice.reducerPath]: apiSlice.reducer,
            [protectedApiSlice.reducerPath]: protectedApiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware, protectedApiSlice.middleware),
    })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']