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

import { sendTip } from '../../helpers/polkadotApi';
import DialogTitle from '../common/DialogTitle.component';
import { useStyles } from '../login/login.style';
import { useMyriadAccount } from '../wallet/wallet.context';

interface InputState {
  amount: string;
}

interface TxHistory {
  txHash: String;
  from: String;
  to: String;
  amount: Number;
}

interface InputErorState {
  isErrorInput: boolean;
  isTextChanged: boolean;
}

interface SendTipConfirmed {
  isConfirmed: boolean;
  message: string;
}

const SendTipModal = forwardRef((_, ref) => {
  const { state: myriadAccount } = useMyriadAccount();
  const [TxHistory, setTxHistory] = useState<TxHistory>({
    txHash: '',
    from: '',
    to: '',
    amount: 0
  });

  const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
    isConfirmed: false,
    message: ''
  });
  useEffect(() => {
    console.log('the history is: ', TxHistory);
    // call myriad API to store TxHistory
    setSendTipConfirmed({
      isConfirmed: true,
      message: 'Tip sent successfully!'
    });
  }, [TxHistory]);

  const [showSendTipModal, setShowSendTipModal] = useState(false);
  const [inputError, setInputError] = useState<InputErorState>({
    isErrorInput: false,
    isTextChanged: false
  });
  const [values, setValues] = useState<InputState>({
    amount: ''
  });
  const [open, setOpen] = useState<boolean>(false);
  const styles = useStyles();

  useImperativeHandle(ref, () => ({
    triggerSendTipModal: () => {
      setShowSendTipModal(true);
    }
  }));

  const closeSendTipModal = () => {
    setShowSendTipModal(false);
    setInputError({
      isTextChanged: false,
      isErrorInput: false
    });
  };

  const checkAmountThenSend = async () => {
    const regexValidDigits = /^(?:[1-9][0-9]*|0)$/;
    if (values.amount === '') {
      setInputError({
        isErrorInput: false,
        isTextChanged: true
      });
    }
    if (regexValidDigits.test(values.amount)) {
      setInputError({
        isErrorInput: false,
        isTextChanged: true
      });
      const amountSent = Number(values.amount) * 10000000000;
      // sendTip will open a pop-up from polkadot.js extension,
      // tx signing is done by supplying a password
      const ALICE = 'tkTptH5puVHn8VJ8NWMdsLa2fYGfYqV8QTyPRZRiQxAHBbCB4';

      const response = await sendTip(ALICE, amountSent);
      // handle if sendTip succeed
      if (typeof response === 'object') {
        setTxHistory({
          txHash: response.txHash,
          to: ALICE,
          amount: amountSent,
          from: response.from
        });
        setOpen(true);
        setShowSendTipModal(false);
      }
    } else {
      setInputError({
        isErrorInput: true,
        isTextChanged: true
      });
    }
  };

  const handleChange = (prop: keyof InputState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClose = (reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
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
            Free balance: {myriadAccount.freeBalance.toFixed(3)} MYRIA
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
              helperText={inputError.isErrorInput ? 'Put digits bigger than zero!' : 'Please input valid digits'}
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

      <Snackbar open={open} autoHideDuration={4000}>
        <Alert severity="success">
          <AlertTitle>Success!</AlertTitle>
          {sendTipConfirmed.message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default SendTipModal;
