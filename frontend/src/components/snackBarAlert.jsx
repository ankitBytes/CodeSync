import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackBarAlert = ({ open, message, severity = 'info', onClose, autoHideDuration = 4000 }) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBarAlert;