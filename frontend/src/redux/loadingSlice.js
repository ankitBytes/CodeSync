import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingRequests: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    requestStarted: (state) => {
      state.pendingRequests += 1;
    },
    requestFinished: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
    resetLoading: (state) => {
      state.pendingRequests = 0;
    },
  },
});

export const { requestStarted, requestFinished, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

