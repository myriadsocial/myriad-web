import React, { useState, forwardRef, useImperativeHandle } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, lighten } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import DialogTitle from '../common/DialogTitle.component';

import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
import * as WalletAddressAPI from 'src/lib/api/wallet';

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
  postId?: string;
  freeBalance?: number;
  receiverId?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.primary.light,
      padding: '15px 29px',
      color: '#E0E0E0',
      flex: '0 0 100%',
      width: 320
    },
    title: {
      paddingBottom: 10,
      borderBottom: '5px solid',
      borderBottomColor: theme.palette.secondary.main
    },
    action: {
      marginTop: 25
    },
    button: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      textTransform: 'none'
    },
    buttonIcon: {
      marginBottom: theme.spacing(1.5),
      borderRadius: 0,
      '&& .MuiButton-label': {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: '60%'
      }
    },
    whiteLightButton: {
      marginBottom: 10,
      backgroundColor: lighten('#f4f5e2', 0.3),
      textAlign: 'left',
      borderRadius: 20
    },
    lightButton: {
      marginBottom: 10,
      backgroundColor: lighten('#E849BD', 0.3),
      textAlign: 'left',
      borderRadius: 20
    },
    btnCreateAccount: {
      margin: '8px 16px'
    },
    info: {
      marginBottom: theme.spacing(2)
    },
    polkadot: {
      color: 'rgb(255, 140, 0)'
    },
    spinner: {
      color: '#A942E9',
      position: 'relative',
      top: 4,
      left: 6
    },
    sendTipDialog: {
      minWidth: '400px'
    },
    errorText: {
      color: 'red'
    }
  })
);

const SendTipModal = forwardRef(({ freeBalance, userAddress, postId, receiverId }: Props, ref) => {
  const { sendTip, load } = usePolkadotApi();
  const [selectedToken, setSelectedToken] = useState('ACA');
  //const [tokenBalance, setTokenBalance] = useState('');

  const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
    isConfirmed: false,
    message: ''
  });

  const [errorSendTips, setErrorSendTips] = useState({
    isError: false,
    message: null
  });

  const [showSendTipModal, setShowSendTipModal] = useState(false);
  const [inputError, setInputError] = useState<InputErorState>({
    isErrorInput: false,
    isTextChanged: false,
    isInsufficientBalance: false,
    errorMessage: 'Digits must be bigger than zero!'
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

  // TODO: input ditambahin decimals masing2 token
  const checkAmountThenSend = async () => {
    const regexValidDigits = /^\d*(\.\d+)?$/;
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

      if (freeBalance !== undefined && Number(values.amount) >= freeBalance) {
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
        const decimals = selectedToken === 'ACA' ? 13 : 10;
        const amountStr = values.amount as string;
        const amountSent = Number(parseInt(amountStr) * 10 ** decimals);

        // sendTip will open a pop-up from polkadot.js extension,
        // tx signing is done by supplying a password
        const senderAddress = userAddress;

        let toAddress = '';

        //check if sending tips from a comment or from a post
        if (postId === undefined) {
          toAddress = receiverId as string;
        } else {
          const { walletAddress } = await WalletAddressAPI.getWalletAddress(postId as string);
          toAddress = walletAddress;
        }

        const response = await sendTip(senderAddress, toAddress, amountSent, postId);
        // handle if sendTip succeed
        if (response.Error || typeof response === 'string') {
          setErrorSendTips({
            ...errorSendTips,
            isError: true,
            message: response.Error || response
          });
          setShowSendTipModal(false);
          setValues({
            ...values,
            amount: ''
          });
          return;
        }
        if (response.from === senderAddress) {
          setSendTipConfirmed({
            isConfirmed: true,
            message: 'Tip sent successfully!'
          });
          setShowSendTipModal(false);
          setValues({
            ...values,
            amount: ''
          });
          //load(userAddress);
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

  const handleCloseErrorSendTips = () => {
    setErrorSendTips({
      ...errorSendTips,
      isError: false
    });
  };

  const handleSetSelectedToken = (event: React.ChangeEvent<{ value: unknown }>) => {
    const token = event.target.value as string;
    setSelectedToken(token);
    //load(userAddress);
    //if (token === 'DOT') {
    //setTokenBalance(formattedDOT());
    //} else {
    //setTokenBalance(formattedACA());
    //}
  };

  return (
    <>
      <Dialog open={showSendTipModal} onClose={closeSendTipModal} aria-labelledby="send-tips-window" maxWidth="md">
        <DialogTitle id="name" onClose={closeSendTipModal}>
          {' '}
          Send Tip
        </DialogTitle>
        {
          <DialogContent dividers>
            <FormControl>
              <InputLabel aria-label="select-token-for-send-tips">Select token</InputLabel>
              <Select value={selectedToken} onChange={handleSetSelectedToken}>
                <MenuItem value={'DOT'}>DOT</MenuItem>
                <MenuItem value={'ACA'}>ACA</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
        }
        <DialogContent dividers>
          <Typography>{freeBalance} ACA</Typography>
        </DialogContent>
        <DialogContent dividers>
          <form noValidate autoComplete="off">
            <TextField
              value={values.amount}
              onChange={handleChange('amount')}
              required
              error={inputError.isErrorInput ? true : false}
              id="sendTipAmount"
              label="How many ACA?"
              helperText={
                inputError.isErrorInput
                  ? inputError.isInsufficientBalance
                    ? inputError.errorMessage
                    : 'Digits must be bigger than zero!'
                  : 'Digits only'
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

      <Snackbar open={sendTipConfirmed.isConfirmed} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success">
          <AlertTitle>Success!</AlertTitle>
          {sendTipConfirmed.message}
        </Alert>
      </Snackbar>

      <Snackbar open={errorText.isError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {errorText.message}
        </Alert>
      </Snackbar>

      <Snackbar open={errorSendTips.isError} autoHideDuration={6000} onClose={handleCloseErrorSendTips}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {errorSendTips.message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default SendTipModal;
