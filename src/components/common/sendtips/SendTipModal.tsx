import React, {useState, forwardRef, useImperativeHandle, useEffect} from 'react';

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
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';

import DialogTitle from '../DialogTitle.component';
import {useStyles, TableCell} from './send-tips.style';

import {useAlertHook} from 'src/hooks/use-alert.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {
  InputState,
  InputErrorState,
  SendTipConfirmed,
  Props,
} from 'src/interfaces/send-tips/send-tips';

enum ContentType {
  POST = 'postContent',
  COMMENT = 'commentContent',
}

//TODO: move codes to different files, too big!

const SendTipModal = forwardRef(
  (
    {
      balanceDetails,
      walletReceiverDetail,
      userAddress,
      postId,
      receiverId,
      success,
      availableTokens,
    }: Props,
    ref,
  ) => {
    const {sendTip, load, trxHash, sendTipSuccess, error} = usePolkadotApi();
    const [showSendTipModal, setShowSendTipModal] = useState(false);
    const [selectedToken, setSelectedToken] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [tipAmount, setTipAmount] = useState(0);
    const [wsAddress, setWSAddress] = useState('');
    const [tippedContent, setTippedContent] = useState<ContentType>();
    const [selectedTokenDecimals, setSelectedTokenDecimals] = useState(0);
    const [sendTipClicked, setSendTipClicked] = useState(false);
    const [tokenBalance, setTokenBalance] = useState('');
    const {showTipAlert, showAlert} = useAlertHook();

    useEffect(() => {
      if (sendTipSuccess) {
        showTipAlert({
          severity: 'success',
          title: 'Tip sent!',
          message: `${trxHash}`,
        });
      }
    }, [sendTipSuccess]);

    useEffect(() => {
      if (error) {
        showAlert({
          severity: 'error',
          title: 'Error!',
          message: `Something is wrong`,
        });
      }
    }, [error]);

    useImperativeHandle(ref, () => ({
      triggerSendTipModal: () => {
        setShowSendTipModal(true);
      },
    }));

    const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
      isConfirmed: false,
      message: '',
    });

    const [inputError, setInputError] = useState<InputErrorState>({
      isErrorInput: false,
      isTextChanged: false,
      isInsufficientBalance: false,
      errorMessage: 'Please input a number larger than 0!',
    });
    const [values, setValues] = useState<InputState>({
      amount: '',
    });

    useEffect(() => {
      if (sendTipConfirmed.isConfirmed) {
        success(postId);
      }
    }, [sendTipConfirmed]);

    const styles = useStyles();

    useEffect(() => {
      if (trxHash.length > 0) {
        setSendTipConfirmed({
          isConfirmed: true,
          message: 'Tip sent successfully!',
        });
        setShowSendTipModal(false);
        setValues({
          ...values,
          amount: '',
        });
        load(userAddress, availableTokens);
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
      // TODO: this function needs to be separated into smaller chunks for the love of God!
      const regexValidDigits = /^\d*(\.\d+)?$/;

      if (values.amount === '') {
        setInputError({
          ...inputError,
          isErrorInput: false,
          isTextChanged: true,
        });
      }
      if (regexValidDigits.test(values.amount)) {
        setInputError({
          ...inputError,
          isErrorInput: false,
          isTextChanged: true,
        });

        if (tokenBalance !== undefined && Number(values.amount) >= Number(tokenBalance)) {
          setInputError({
            ...inputError,
            isErrorInput: true,
            isTextChanged: true,
            isInsufficientBalance: true,
            errorMessage: 'Insufficient balance',
          });
        } else {
          // amount valid, reset InputError state
          setInputError({
            isErrorInput: false,
            isTextChanged: true,
            isInsufficientBalance: false,
            errorMessage: '',
          });

          const idx = balanceDetails.findIndex(item => item.tokenSymbol === selectedToken);
          const decimals = balanceDetails[idx].tokenDecimals ?? 0;
          setSelectedTokenDecimals(decimals);

          const amountStr = values.amount as string;
          const amountSent = Number(amountStr) * 10 ** decimals;
          setTipAmount(amountSent);

          // sendTip will open a pop-up from polkadot.js extension,
          // tx signing is done by supplying a password
          setSenderAddress(userAddress);

          if (postId === undefined) {
            setTippedContent(ContentType.COMMENT);
          } else {
            setTippedContent(ContentType.POST);
          }
        }
      } else {
        setInputError({
          ...inputError,
          isErrorInput: true,
          isTextChanged: true,
          isInsufficientBalance: false,
        });
      }
    };

    interface SendTipWithPayloadProps {
      senderAddress: string;
      toAddress: string;
      amountSent: number;
      decimals: number;
      currencyId: string;
      postId: string;
      wsAddress: string;
    }

    const sendTipWithPayload = ({
      senderAddress,
      toAddress,
      amountSent,
      decimals,
      currencyId,
      postId,
      wsAddress,
    }: SendTipWithPayloadProps) => {
      const sendTipPayload = {
        fromAddress: senderAddress,
        toAddress,
        amountSent,
        decimals,
        currencyId,
        postId,
        wsAddress,
      };

      sendTip(sendTipPayload);
    };

    useEffect(() => {
      if (walletReceiverDetail && sendTipClicked && tippedContent) {
        switch (tippedContent) {
          case ContentType.COMMENT:
            sendTipWithPayload({
              senderAddress,
              toAddress: receiverId as string,
              amountSent: tipAmount,
              decimals: selectedTokenDecimals,
              currencyId: selectedToken,
              postId: '',
              wsAddress,
            });
            break;
          default:
            sendTipWithPayload({
              senderAddress,
              toAddress: walletReceiverDetail.walletAddress,
              amountSent: tipAmount,
              decimals: selectedTokenDecimals,
              currencyId: selectedToken,
              postId: walletReceiverDetail.postId,
              wsAddress,
            });
            break;
        }
      }
    }, [sendTipClicked, walletReceiverDetail, tippedContent]);

    const handleChange =
      (prop: keyof InputState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, [prop]: event.target.value});
      };

    const handleSetSelectedToken = (event: React.ChangeEvent<HTMLInputElement>) => {
      const clickedToken = (event.target as HTMLInputElement).value;
      setSelectedToken(clickedToken);

      availableTokens.forEach(token => {
        if (token.id === clickedToken) {
          setWSAddress(token.rpc_address);
        }
      });
    };

    const closeSendTipModal = () => {
      setShowSendTipModal(false);
      setSendTipClicked(false);
    };

    const handleSendTip = () => {
      checkAmountThenSend();
      setSendTipClicked(true);
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
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={selectedToken}
                    onChange={handleSetSelectedToken}>
                    <TableCell component="th" scope="row">
                      {row.tokenSymbol === 'MYR' ? (
                        <></>
                      ) : (
                        <>
                          <FormControlLabel
                            value={row.tokenSymbol}
                            control={<Radio />}
                            label={row.tokenSymbol}
                          />
                        </>
                      )}
                    </TableCell>
                  </RadioGroup>
                  <TableCell align="right">
                    {row.tokenSymbol === 'MYR' ? (
                      <></>
                    ) : (
                      <Typography className={styles.balanceText}>{row.freeBalance}</Typography>
                    )}
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
        <Dialog
          open={showSendTipModal}
          onClose={closeSendTipModal}
          aria-labelledby="send-tips-window"
          maxWidth="md">
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
                  inputError.isErrorInput
                    ? inputError.isInsufficientBalance
                      ? inputError.errorMessage
                      : 'Invalid input'
                    : 'Digits only'
                }
                variant="outlined"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              className={styles.whiteLightButton}
              fullWidth={true}
              size="large"
              variant="contained"
              onClick={closeSendTipModal}>
              Cancel
            </Button>
            <Button
              className={styles.lightButton}
              fullWidth={true}
              size="large"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={balanceDetails === undefined}
              onClick={handleSendTip}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
);

export default SendTipModal;
