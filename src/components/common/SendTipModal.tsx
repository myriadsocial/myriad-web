import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { useSession } from 'next-auth/client';

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

import Axios from 'axios';

const client = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

interface InputState {
  amount: string;
}

interface TxHistory {
  trxHash: string;
  from: string;
  to: string;
  amount: number;
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

interface PostTxHistory {
  from: string;
  to: string;
  amount: number;
  trxHash: string;
}

const SendTipModal = forwardRef((_, ref) => {
  const { state: myriadAccount } = useMyriadAccount();
  const [TxHistory, setTxHistory] = useState<TxHistory>({
    trxHash: '',
    from: '',
    to: '',
    amount: 0
  });

  const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
    isConfirmed: false,
    message: ''
  });
  useEffect(() => {
    const senderAddress = session?.user.address;
    console.log('the sender address is:', senderAddress);
    //console.log('the history is: ', TxHistory);
    // call myriad API to store TxHistory
    if (TxHistory.trxHash.length > 0) {
      (async () => {
        const { trxHash, from, to, amount } = TxHistory;
        await postTxHistory({ trxHash, from, to, amount });
      })();
      setSendTipConfirmed({
        isConfirmed: true,
        message: 'Tip sent successfully!'
      });
    }
  }, [TxHistory]);

  const postTxHistory = async ({ from, to, amount, trxHash }: PostTxHistory) => {
    try {
      const response = await client({
        method: 'POST',
        url: '/transactions',
        data: {
          from,
          to,
          trxHash,
          value: Number(amount) / 10000000000,
          state: 'verified',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      });

      if (response.status === 200) {
        console.log(`TxHistory saved successfully!`);
      }
    } catch (error) {
      console.log(`error from postTxHistory: ${error}`);
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
  const [open, setOpen] = useState<boolean>(false);
  const [session] = useSession();
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

      if (Number(values.amount) >= myriadAccount.freeBalance) {
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
        const amountSent = Number(values.amount) * 10000000000;
        // sendTip will open a pop-up from polkadot.js extension,
        // tx signing is done by supplying a password
        const ALICE = 'tkTptH5puVHn8VJ8NWMdsLa2fYGfYqV8QTyPRZRiQxAHBbCB4';
        const senderAddress = session?.user.address;
        console.log('the sender address is:', senderAddress);

        const response = await sendTip(senderAddress, ALICE, amountSent);
        // handle if sendTip succeed
        if (typeof response === 'object') {
          setTxHistory({
            trxHash: response.trxHash,
            to: ALICE,
            amount: amountSent,
            from: response.from
          });
          setOpen(true);
          setShowSendTipModal(false);
        }
      }
    } else {
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
