import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import { getBalance } from '../../helpers/polkadotApi';
import { sendTip } from '../../helpers/polkadotApi';
import DialogTitle from '../common/DialogTitle.component';
import { useStyles } from '../login/login.style';

interface InputState {
  amount: string;
}

interface InputErorState {
  isErrorInput: boolean;
  isTextChanged: boolean;
  isInsufficientBalance: boolean;
  errorMessage: string;
}

interface SendTipConfirmed {
  isConfirmed: boolean;
  message: string;
}

type Props = {
  userAddress: string;
  walletAddress?: string;
};

const SendTipModal = forwardRef(({ userAddress, walletAddress }: Props, ref) => {
  const [balance, setBalance] = useState(0);

  const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
    isConfirmed: false,
    message: ''
  });

  useEffect(() => {
    (async () => {
      await getBalanceForComponent();
    })();
  }, []);

  const getBalanceForComponent = async () => {
    const currentAddress = userAddress;
    const freeBalance = await getBalance(currentAddress);
    if (freeBalance) {
      setBalance(Number((freeBalance / 100).toFixed(3)));
    }
  };

  const [showSendTipModal, setShowSendTipModal] = useState(false);
  const [inputError, setInputError] = useState<InputErorState>({
    isErrorInput: false,
    isTextChanged: false,
    isInsufficientBalance: false,
    errorMessage: 'Put digits bigger than zero'
  });
  const [values, setValues] = useState<InputState>({
    amount: ''
  });
  const styles = useStyles();

  useImperativeHandle(ref, () => ({
    triggerSendTipModal: () => {
      setShowSendTipModal(true);
    }
  }));

  const closeSendTipModal = () => {
    setShowSendTipModal(false);
    setInputError({
      ...inputError,
      isTextChanged: false,
      isErrorInput: false
    });
  };

  const [errorText, setErrorText] = useState({
    isError: false,
    message: ''
  });
  const handleCloseError = () => {
    setErrorText({
      ...errorText,
      isError: false
    });
  };

  const checkAmountThenSend = async () => {
    const regexValidDigits = /^(?:[1-9][0-9]*|0)$/;
    if (values.amount === '') {
      setInputError({
        ...inputError,
        isErrorInput: false,
        isTextChanged: true
      });
    }
    if (regexValidDigits.test(values.amount)) {
      setInputError({
        ...inputError,
        isErrorInput: false,
        isTextChanged: true
      });

      if (Number(values.amount) >= balance) {
        setInputError({
          ...inputError,
          isErrorInput: true,
          isTextChanged: true,
          isInsufficientBalance: true,
          errorMessage: 'Insufficient balance'
        });
      } else {
        // amount valid, reset InputError state
        setInputError({
          isErrorInput: false,
          isTextChanged: true,
          isInsufficientBalance: false,
          errorMessage: ''
        });
        const amountSent = Number(values.amount) * 1000000000000;
        // sendTip will open a pop-up from polkadot.js extension,
        // tx signing is done by supplying a password
        const senderAddress = userAddress;

        const response = await sendTip(senderAddress, walletAddress, amountSent);
        // handle if sendTip succeed
        if (typeof response === 'object') {
          setSendTipConfirmed({
            isConfirmed: true,
            message: 'Tip sent successfully!'
          });
          setShowSendTipModal(false);
          getBalanceForComponent();
        }
      }
    } else {
      setErrorText({
        ...errorText,
        isError: true,
        message: 'Send tips failed!'
      });

      setInputError({
        ...inputError,
        isErrorInput: true,
        isTextChanged: true,
        isInsufficientBalance: false
      });
    }
  };

  const handleChange = (prop: keyof InputState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClose = () => {
    setSendTipConfirmed({
      ...sendTipConfirmed,
      isConfirmed: false
    });
  };

  return (
    <>
      <Dialog open={showSendTipModal} onClose={closeSendTipModal} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="name" onClose={closeSendTipModal}>
          {' '}
          Send Tip
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom={true} variant="body1">
            Free balance: {balance} MYRIA
          </Typography>
        </DialogContent>
        <DialogContent dividers>
          <form noValidate autoComplete="off">
            <TextField
              value={values.amount}
              onChange={handleChange('amount')}
              required
              error={inputError.isErrorInput ? true : false}
              id="sendTipAmount"
              label="How many MYRIA?"
              helperText={
                inputError.isErrorInput
                  ? inputError.isInsufficientBalance
                    ? inputError.errorMessage
                    : 'Put digits bigger than zero!'
                  : 'Please input valid digits'
              }
              variant="outlined"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button className={styles.whiteLightButton} fullWidth={true} size="large" variant="contained" onClick={closeSendTipModal}>
            Cancel
          </Button>
          <Button
            className={styles.lightButton}
            fullWidth={true}
            size="large"
            variant="contained"
            startIcon={<SendIcon />}
            onClick={checkAmountThenSend}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={sendTipConfirmed.isConfirmed} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="success">
          <AlertTitle>Success!</AlertTitle>
          {sendTipConfirmed.message}
        </Alert>
      </Snackbar>

      <Snackbar open={errorText.isError} autoHideDuration={3000} onClose={handleCloseError}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {errorText.message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default SendTipModal;
