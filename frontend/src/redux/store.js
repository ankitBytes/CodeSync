import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';
import notificationReducer from './notificationSlice';
import sessionReducer from './sessionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    notification: notificationReducer,
    session: sessionReducer,
  },
});
