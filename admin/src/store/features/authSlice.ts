import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    isLoggedIn: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
        clearAuthState: (state) => {
            state.isLoggedIn = false;
        }
    }
})

export const { setIsLoggedIn, clearAuthState } = authSlice.actions;
export default authSlice.reducer;