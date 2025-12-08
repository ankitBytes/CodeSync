import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SnackBarAlert from './snackBarAlert';
import { hideNotification } from '../redux/notificationSlice';

const GlobalSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((s) => s.notification);
  return (
    <SnackBarAlert
      open={open}
      message={message}
      severity={severity}
      onClose={() => dispatch(hideNotification())}
    />
  );
};

export default GlobalSnackbar;


