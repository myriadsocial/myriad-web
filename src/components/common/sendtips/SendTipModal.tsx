import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import SendIcon from '@material-ui/icons/Send';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import DialogTitle from '../DialogTitle.component';
import { useStyles, TableCell, StyledBadge } from './send-tips.style';
import { useWalletAddress } from './use-wallet.hook';

import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
import { InputState, InputErrorState, SendTipConfirmed, Props } from 'src/interfaces/send-tips/send-tips';

const SendTipModal = forwardRef(({ balanceDetails, userAddress, postId, receiverId }: Props, ref) => {
  const { sendTip, load, trxHash, error } = usePolkadotApi();
  const { loadWalletAddress, walletAddress } = useWalletAddress(postId);
  const [selectedToken, setSelectedToken] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');

  const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
    isConfirmed: false,
    message: ''
  });

  const [errorSendTips, setErrorSendTips] = useState({
    isError: false,
    message: ''
  });

  const [showSendTipModal, setShowSendTipModal] = useState(false);
  const [inputError, setInputError] = useState<InputErrorState>({
    isErrorInput: false,
    isTextChanged: false,
    isInsufficientBalance: false,
    errorMessage: 'Please input a number larger than 0!'
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

  useEffect(() => {
    //console.log('load send tip modal');
    loadWalletAddress();

    setSendTipConfirmed({
      isConfirmed: false,
      message: ''
    });

    setErrorSendTips({
      ...errorSendTips,
      isError: false,
      message: ''
    });
  }, []);

  useEffect(() => {
    if (trxHash.length > 0) {
      setSendTipConfirmed({
        isConfirmed: true,
        message: 'Tip sent successfully!'
      });
      setShowSendTipModal(false);
      setValues({
        ...values,
        amount: ''
      });
      load(userAddress);
    }
  }, [trxHash]);

  useEffect(() => {
    if (error) {
      setErrorSendTips({
        ...errorSendTips,
        isError: true,
        message: 'Something is wrong, please try again!'
      });
      setShowSendTipModal(false);
      setValues({
        ...values,
        amount: ''
      });
    }
  }, [error]);

  useEffect(() => {
    if (balanceDetails?.length > 0) {
      const idx = balanceDetails.findIndex(item => item.tokenSymbol === selectedToken);
      if (typeof idx === 'number') {
        setTokenBalance(balanceDetails[idx]?.freeBalance.toString() ?? '');
      }
    }
  }, [selectedToken, balanceDetails]);

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

  const checkAmountThenSend = () => {
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

      if (tokenBalance !== undefined && Number(values.amount) >= Number(tokenBalance)) {
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

        const idx = balanceDetails.findIndex(item => item.tokenSymbol === selectedToken);
        let decimals = balanceDetails[idx].tokenDecimals ?? 0;

        const amountStr = values.amount as string;
        const amountSent = Number(amountStr) * 10 ** decimals;

        // sendTip will open a pop-up from polkadot.js extension,
        // tx signing is done by supplying a password
        const senderAddress = userAddress;

        let toAddress = '';

        //check if sending tips from a comment or from a post
        if (postId === undefined) {
          toAddress = receiverId as string;
        } else {
          toAddress = walletAddress;
        }
        //console.log('amount sent: ', amountSent);

        const sendTipPayload = {
          fromAddress: senderAddress,
          toAddress,
          amountSent,
          decimals,
          currencyId: selectedToken,
          postId
        };

        sendTip(sendTipPayload);
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

  const handleSetSelectedToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedToken((event.target as HTMLInputElement).value);
  };

  const TooltipContent = () => {
    return (
      <div className={styles.tooltipContentRoot}>
        <Typography className={styles.tooltipContentHeader}>Myria</Typography>{' '}
        <Typography>A reward token you earn by sending a tip to a post you think is valuable.</Typography>
      </div>
    );
  };

  const StyledTooltip = () => {
    return (
      <Tooltip title={<TooltipContent />} placement="right" aria-label="myria-token-info">
        <InfoIcon fontSize="small" />
      </Tooltip>
    );
  };

  const CurrencyTable = () => {
    return (
      <TableContainer>
        <Table size="small" aria-label="balance-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography className={styles.balanceText}>Currency Selection</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography className={styles.balanceText}>Your Balance</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balanceDetails.map(row => (
              <TableRow key={row.tokenSymbol}>
                <RadioGroup aria-label="gender" name="gender1" value={selectedToken} onChange={handleSetSelectedToken}>
                  <TableCell component="th" scope="row">
                    {row.tokenSymbol === 'MYRIA' ? (
                      <>
                        {' '}
                        <StyledBadge badgeContent={<StyledTooltip />}>MYRIA</StyledBadge>
                      </>
                    ) : (
                      <>
                        <FormControlLabel value={row.tokenSymbol} control={<Radio />} label={row.tokenSymbol} />
                      </>
                    )}
                  </TableCell>
                </RadioGroup>
                <TableCell align="right">
                  <Typography className={styles.balanceText}>{row.freeBalance}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const hideDuration = 3000;

  const handleExtrinsicExplorer = (event: React.SyntheticEvent) => {
    window.open(`https://acala-testnet.subscan.io/extrinsic/${trxHash}`, '_blank');
    event.preventDefault();
  };

  return (
    <>
      <Dialog open={showSendTipModal} onClose={closeSendTipModal} aria-labelledby="send-tips-window" maxWidth="md">
        <DialogTitle id="name" onClose={closeSendTipModal}>
          {' '}
          Send Tip
        </DialogTitle>
        <DialogContent dividers>
          <CurrencyTable />
        </DialogContent>
        <DialogContent dividers>
          <form noValidate autoComplete="off">
            <TextField
              value={values.amount}
              onChange={handleChange('amount')}
              required
              error={inputError.isErrorInput ? true : false}
              id="sendTipAmount"
              label={`How many ${selectedToken}`}
              helperText={
                inputError.isErrorInput ? (inputError.isInsufficientBalance ? inputError.errorMessage : 'Invalid input') : 'Digits only'
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
            disabled={balanceDetails === undefined}
            onClick={checkAmountThenSend}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={sendTipConfirmed.isConfirmed} autoHideDuration={hideDuration} onClose={handleClose}>
        <Alert severity="success">
          <AlertTitle>Success!</AlertTitle>
          {sendTipConfirmed.message}
          <br />
          TxHash:{' '}
          <a target="_blank" onClick={handleExtrinsicExplorer} rel="noopener noreferrer">
            {trxHash}
          </a>
        </Alert>
      </Snackbar>

      <Snackbar open={errorText.isError} autoHideDuration={hideDuration} onClose={handleCloseError}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {errorText.message}
        </Alert>
      </Snackbar>

      <Snackbar open={errorSendTips.isError} autoHideDuration={hideDuration} onClose={handleCloseErrorSendTips}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          {errorSendTips.message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default SendTipModal;
