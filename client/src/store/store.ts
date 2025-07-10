import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './features/NavigationSlice';
import { apiSlice } from './features/apiSlice';

export const store = () => {
    return configureStore({
        reducer: {
            navigation: navigationReducer,
            [apiSlice.reducerPath]: apiSlice.reducer,   
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']