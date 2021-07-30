import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import SendIcon from '@material-ui/icons/Send';

import DialogTitle from '../DialogTitle.component';
import {CurrencyTableComponent} from './currencyTable.component';
import {useStyles} from './send-tips.style';
import {TipAmountFieldComponent} from './tipAmountField.component';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {
  InputState,
  InputErrorState,
  Props,
  SendTipWithPayloadProps,
} from 'src/interfaces/send-tips/send-tips';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const SendTipModal = ({isShown, hide, userAddress, postId, success, availableTokens}: Props) => {
  //TODO: move to redux
  const {sendTip, loading, load, tokensReady: balanceDetails} = usePolkadotApi();
  const {recipientDetail} = useSelector<RootState, UserState>(state => state.userState);
  const styles = useStyles();

  const [senderAddress, setSenderAddress] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [sendTipClicked, setSendTipClicked] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('');

  const [tokenProperties, setTokenProperties] = useState({
    wsAddress: '',
    tokenDecimals: 0,
    tokenId: '',
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

  // reset form
  useEffect(() => {
    handleClearValue();
    console.log({loading});
  }, []);

  // load balance detail only when component need to be shown
  useEffect(() => {
    if (isShown) {
      load(userAddress, availableTokens);
    }
  }, [isShown]);

  useEffect(() => {
    console.log({recipientDetail});
    if (recipientDetail && sendTipClicked) {
      dispatchSendTip();
    }
  }, [sendTipClicked, recipientDetail, tokenProperties, tipAmount]);

  useEffect(() => {
    if (balanceDetails?.length > 0) {
      handleChangeTokenBalance();
    }
  }, [tokenProperties.tokenId, balanceDetails]);

  const handleClearValue = () => {
    setValues({
      ...values,
      amount: '',
    });
  };

  const handleChangeTokenBalance = () => {
    const idx = balanceDetails.findIndex(item => item.tokenSymbol === tokenProperties.tokenId);
    if (typeof idx === 'number') {
      setTokenBalance(balanceDetails[idx]?.freeBalance.toString() ?? '');
    }
  };

  const handleInputEmpty = () => {
    setInputError({
      ...inputError,
      isErrorInput: false,
      isTextChanged: true,
    });
  };

  const handleInsufficientBalance = () => {
    setInputError({
      ...inputError,
      isErrorInput: true,
      isTextChanged: true,
      isInsufficientBalance: true,
      errorMessage: 'Insufficient balance',
    });
  };

  const handleResetInputError = () => {
    // amount valid, reset InputError state
    setInputError({
      isErrorInput: false,
      isTextChanged: true,
      isInsufficientBalance: false,
      errorMessage: '',
    });
  };

  const findDecimals = () => {
    const idx = balanceDetails.findIndex(item => item.tokenSymbol === tokenProperties.tokenId);
    const decimals = balanceDetails[idx].tokenDecimals ?? 0;

    return decimals;
  };

  const defineTipAmount = (decimals: number) => {
    const amountStr = values.amount as string;
    const amountSent = Number(amountStr) * 10 ** decimals;
    setTipAmount(amountSent);
  };

  const handleInputError = () => {
    setInputError({
      ...inputError,
      isErrorInput: true,
      isTextChanged: true,
      isInsufficientBalance: false,
    });
  };

  const checkAmountThenSend = () => {
    const regexValidDigits = /^\d*(\.\d+)?$/;

    if (values.amount === '') {
      handleInputEmpty();
    }
    if (regexValidDigits.test(values.amount)) {
      handleInputEmpty();

      if (tokenBalance !== undefined && Number(values.amount) >= Number(tokenBalance)) {
        handleInsufficientBalance();
      } else {
        handleResetInputError();

        const decimals = findDecimals();

        defineTipAmount(decimals);

        setSendTipClicked(true);

        // sendTip will open a pop-up from polkadot.js extension,
        // tx signing is done by supplying a password
        setSenderAddress(userAddress);
      }
    } else {
      handleInputError();
    }
  };

  const handleCloseModal = () => {
    hide();
  };

  const sendTipWithPayload = ({
    senderAddress,
    toAddress,
    amountSent,
    decimals,
    currencyId,
    postId,
    contentType,
    wsAddress,
  }: SendTipWithPayloadProps) => {
    const sendTipPayload = {
      fromAddress: senderAddress,
      toAddress,
      amountSent,
      decimals,
      currencyId,
      postId,
      contentType,
      wsAddress,
    };

    sendTip(sendTipPayload, () => {
      handleCloseModal();
      setSendTipClicked(false);
      success(postId);
    });
  };

  const dispatchSendTip = () => {
    sendTipWithPayload({
      senderAddress,
      toAddress: recipientDetail.walletAddress,
      amountSent: tipAmount,
      decimals: tokenProperties.tokenDecimals,
      currencyId: tokenProperties.tokenId,
      postId: recipientDetail.postId,
      contentType: recipientDetail.contentType,
      wsAddress: tokenProperties.wsAddress,
    });
  };

  const handleChange = (prop: keyof InputState, event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [prop]: event.target.value});
  };

  const handleSendTip = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    checkAmountThenSend();
  };

  const handleChangeTokenProperties = (
    wsAddress: string,
    tokenDecimals: number,
    tokenId: string,
  ) => {
    setTokenProperties({
      wsAddress,
      tokenDecimals,
      tokenId,
    });
  };

  useEffect(() => {
    setOpen(!open);
  }, [loading]);

  const [open, setOpen] = useState(false);

  if (!isShown) return null;

  return (
    <>
      <Dialog open={isShown} aria-labelledby="send-tips-window" maxWidth="md">
        {loading && (
          <Backdrop className={styles.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <DialogTitle id="name" onClose={handleCloseModal}>
          {' '}
          Send Tip
        </DialogTitle>
        <DialogContent dividers>
          <CurrencyTableComponent
            balanceDetails={balanceDetails}
            availableTokens={availableTokens}
            onChange={(wsAddress, tokenDecimals, tokenId) =>
              handleChangeTokenProperties(wsAddress, tokenDecimals, tokenId)
            }
          />
        </DialogContent>
        <DialogContent dividers>
          <TipAmountFieldComponent
            value={values.amount}
            onChange={e => handleChange('amount', e)}
            isError={inputError.isErrorInput ? true : false}
            fieldLabel={`How many ${tokenProperties.tokenId}`}
            helperTextField={
              inputError.isErrorInput
                ? inputError.isInsufficientBalance
                  ? inputError.errorMessage
                  : 'Invalid input'
                : 'Digits only'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            className={styles.whiteLightButton}
            fullWidth={true}
            size="large"
            variant="contained"
            onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            className={styles.lightButton}
            fullWidth={true}
            size="large"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={balanceDetails === undefined}
            onClick={e => handleSendTip(e)}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendTipModal;
