import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    accessToken: null,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        },
        
        setUser: (state, action: PayloadAction<TokenPayload | null>) => {
            state.user = action.payload;
        },

        clearAuth: (state) => {
            state.accessToken = null;
            state.user = null;
        }
    }
})

export const { setAccessToken, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;