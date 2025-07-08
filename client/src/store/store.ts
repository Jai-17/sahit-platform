import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './features/NavigationSlice';

export const store = () => {
    return configureStore({
        reducer: {
            navigation: navigationReducer
        }
    })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']