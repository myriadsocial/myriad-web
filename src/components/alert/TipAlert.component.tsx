import React from 'react';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import {useAlertHook} from 'src/hooks/use-alert.hook';

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

const TipAlertComponent: React.FC = () => {
  const style = useStyles();
  const {alert, isTipping, clearAlert} = useAlertHook();

  return (
    <div className={style.root}>
      <Snackbar
        open={isTipping}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={6000}
        onClose={clearAlert}>
        <Alert className={style.alert} severity={alert.severity || 'info'}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.severity === 'success' && alert.message ? (
            <Button
              target="_blank"
              href={`https://acala-testnet.subscan.io/extrinsic/${alert.message}`}>
              TxHash: {alert.message.substring(0, 5)}....{' '}
            </Button>
          ) : (
            alert.message
          )}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TipAlertComponent;
