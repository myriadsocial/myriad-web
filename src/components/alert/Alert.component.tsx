import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import Snackbar from '@material-ui/core/Snackbar';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import {useAlertHook} from 'src/hooks/use-alert.hook';
import {RootState} from 'src/reducers';
import {State as BaseState} from 'src/reducers/base/state';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    alert: {
      width: 400,
      borderRadius: theme.spacing(1),

      '& .MuiAlert-icon': {
        fontSize: 32,
      },
      '& .MuiAlert-message': {
        fontSize: 14,
        fontWeight: 500,
      },
      '& .MuiAlertTitle-root': {
        fontSize: 16,
        fontWeight: 600,
      },
    },
  }),
);

const AlertComponent: React.FC = () => {
  const style = useStyles();

  const {alert, clearAlert, showAlert} = useAlertHook();
  const {error: globalError} = useSelector<RootState, BaseState>(state => state.baseState);

  useEffect(() => {
    if (globalError) {
      if (alert.open) {
        clearAlert();
      }

      showAlert({
        title: globalError?.title || 'Error',
        severity: globalError.severity,
        message: globalError.message,
      });
    }
  }, [globalError]);

  return (
    <div className={style.root}>
      <Snackbar
        open={alert.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={2000}
        onClose={clearAlert}>
        <Alert className={style.alert} severity={alert.severity || 'info'}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AlertComponent;
