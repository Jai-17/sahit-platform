import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
    isMobileNavOpen: boolean;
}

const initialState: NavigationState = {
    isMobileNavOpen: false
}

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setIsMobileNavOpen: (state, action: PayloadAction<boolean>) => {
            state.isMobileNavOpen = action.payload;
        },
        closeMobileNav: (state) => {
            state.isMobileNavOpen = false
        }
    }
})

export const {setIsMobileNavOpen, closeMobileNav} = navigationSlice.actions;
export default navigationSlice.reducer;