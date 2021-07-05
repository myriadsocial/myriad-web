import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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

import DialogTitle from '../DialogTitle.component';
import { useStyles, TableCell, StyledBadge } from './send-tips.style';
import { useWalletAddress } from './use-wallet.hook';

import AlertComponent from 'src/components/alert/Alert.component';
import { useAlertHook } from 'src/hooks/use-alert.hook';
import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
import { InputState, InputErrorState, SendTipConfirmed, Props } from 'src/interfaces/send-tips/send-tips';

const SendTipModal = forwardRef(({ balanceDetails, userAddress, postId, receiverId, success }: Props, ref) => {
  const { sendTip, load, trxHash, sendTipSuccess, error } = usePolkadotApi();
  const { loadWalletAddress, walletAddress } = useWalletAddress(postId);
  const [showSendTipModal, setShowSendTipModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const { showAlert } = useAlertHook();

  useEffect(() => {
    if (sendTipSuccess) {
      showAlert({
        severity: 'success',
        title: 'Tip sent!',
        message: `${trxHash}`
      });
    }
  }, [sendTipSuccess]);

  useEffect(() => {
    if (error) {
      showAlert({
        severity: 'error',
        title: 'Error!',
        message: `Something is wrong`
      });
    }
  }, [error]);

  useImperativeHandle(ref, () => ({
    triggerSendTipModal: () => {
      console.log('the post id is: ', postId);
      setShowSendTipModal(true);
    }
  }));

  const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
    isConfirmed: false,
    message: ''
  });

  const [errorSendTips, setErrorSendTips] = useState({
    isError: false,
    message: ''
  });

  const [inputError, setInputError] = useState<InputErrorState>({
    isErrorInput: false,
    isTextChanged: false,
    isInsufficientBalance: false,
    errorMessage: 'Please input a number larger than 0!'
  });
  const [values, setValues] = useState<InputState>({
    amount: ''
  });

  useEffect(() => {
    if (sendTipConfirmed.isConfirmed) {
      success(postId);
    }
  }, [sendTipConfirmed]);

  const styles = useStyles();

  useEffect(() => {
    loadWalletAddress();
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
    if (balanceDetails?.length > 0) {
      const idx = balanceDetails.findIndex(item => item.tokenSymbol === selectedToken);
      if (typeof idx === 'number') {
        setTokenBalance(balanceDetails[idx]?.freeBalance.toString() ?? '');
      }
    }
  }, [selectedToken, balanceDetails]);

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

  //const handleClose = () => {
  //setSendTipConfirmed({
  //...sendTipConfirmed,
  //isConfirmed: false
  //});
  //};

  //const handleCloseErrorSendTips = () => {
  //setErrorSendTips({
  //...errorSendTips,
  //isError: false
  //});
  //};

  const handleSetSelectedToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedToken((event.target as HTMLInputElement).value);
  };

  const closeSendTipModal = () => {
    setShowSendTipModal(false);
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

      <AlertComponent />
    </>
  );
});

export default SendTipModal;
