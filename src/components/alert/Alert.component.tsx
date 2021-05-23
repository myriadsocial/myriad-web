import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import { useAlertHook } from './use-alert.hook';

const AlertComponent: React.FC = () => {
  const { error, clearAlert } = useAlertHook();

  console.log(error);
  return (
    <>
      <Snackbar
        style={{
          width: '400px'
        }}
        open={error.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        autoHideDuration={6000}
        onClose={clearAlert}>
        <Alert severity={error.severity || 'info'}>
          <AlertTitle>{error.title}</AlertTitle>
          {error.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlertComponent;
