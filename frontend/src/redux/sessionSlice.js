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
        },
        updateParticipants: (state, action) => {
            if (state.currentSession) {
                state.currentSession.participants = action.payload;
            }
        },
    }
});

export default sessionSlice.reducer;
export const { sessionCreated, clearSession, updateParticipants } = sessionSlice.actions;