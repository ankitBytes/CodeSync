import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    email: "",
    currentUserData: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
            state.email = "";
            state.currentUserData = null;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        clearEmail: (state) => {
            state.email = "";
        },
        setCurrentUserData: (state, action) => {
            state.currentUserData = action.payload;
        },
    }
})

export const { loginSuccess, logout, setEmail, clearEmail, setCurrentUserData } = userSlice.actions;
export default userSlice.reducer;