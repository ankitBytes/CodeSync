import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentSession: null
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        sessionCreated: (state, action) => {
            state.currentSession = action.payload;
        },
        clearSession: (state) => {
            state.currentSession = null;
        }
    }
});

export default sessionSlice.reducer;
export const { sessionCreated, clearSession } = sessionSlice.actions;