import React from 'react';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import { useAlertHook } from 'src/hooks/use-alert.hook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2)
      }
    },
    alert: {
      width: 400,
      borderRadius: theme.spacing(1),

      '& .MuiAlert-icon': {
        fontSize: 32
      },
      '& .MuiAlert-message': {
        fontSize: 14,
        fontWeight: 500
      },
      '& .MuiAlertTitle-root': {
        fontSize: 16,
        fontWeight: 600
      }
    }
  })
);

const AlertComponent: React.FC = () => {
  const style = useStyles();
  const { error, clearAlert } = useAlertHook();

  return (
    <div className={style.root}>
      <Snackbar
        open={error.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        autoHideDuration={6000}
        onClose={clearAlert}>
        <Alert className={style.alert} severity={error.severity || 'info'}>
          <AlertTitle>{error.title}</AlertTitle>
          {error.severity === 'success' && error.message ? (
            <Button target="_blank" href={`https://acala-testnet.subscan.io/extrinsic/${error.message}`}>
              TxHash: {error.message.substring(0, 5)}....{' '}
            </Button>
          ) : (
            error.message
          )}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AlertComponent;
