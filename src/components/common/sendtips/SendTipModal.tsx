import React, {useEffect, useState} from 'react';
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

import {useTipSummaryHook} from 'src/components/tip-summary/use-tip-summary.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {InputState, InputErrorState, Props, SendTipProps} from 'src/interfaces/send-tips/send-tips';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {TimelineState} from 'src/reducers/timeline/reducer';
import {WalletState} from 'src/reducers/wallet/reducer';

export type RefProps = {
  openSendTipModal: () => void;
  closeSendTipModal: () => void;
};

const SendTipModal = ({isShown, hide, userAddress, availableTokens}: Props) => {
  const {loading: loadingBalance, balanceDetails} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );
  const {sendTip, loading, isSignerLoading, load, error} = usePolkadotApi();
  const {openTipSummary} = useTipSummaryHook();
  const {recipientDetail} = useSelector<RootState, WalletState>(state => state.walletState);
  const {posts} = useSelector<RootState, TimelineState>(state => state.timelineState);
  const styles = useStyles();

  const [senderAddress, setSenderAddress] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [tokenBalance, setTokenBalance] = useState('');
  const [sendTipClicked, setSendTipClicked] = useState(false);

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
  const [disabled, setDisabled] = useState(true);

  // reset form
  useEffect(() => {
    handleClearValue();
    setSendTipClicked(false);
  }, []);

  useEffect(() => {
    if (error !== null && error === 'Cancelled') {
      handleCloseModal();
    }
  }, [error]);

  // load balance detail only when component need to be shown
  useEffect(() => {
    if (isShown) {
      load(userAddress, availableTokens);
    }
  }, [isShown]);

  useEffect(() => {
    if (sendTipClicked) {
      dispatchSendTip();
    }
  }, [sendTipClicked]);

  useEffect(() => {
    if (balanceDetails?.length > 0) {
      handleChangeTokenBalance();
    }
  }, [tokenProperties.tokenId, balanceDetails]);

  useEffect(() => {
    if (tokenBalance.length > 0 && values.amount.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [tokenBalance, values.amount]);

  const handleClearValue = () => {
    setValues({
      amount: '',
    });
  };

  const handleChangeTokenBalance = () => {
    const idx = balanceDetails.findIndex(item => item.id === tokenProperties.tokenId);
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
    const idx = balanceDetails.findIndex(item => item.id === tokenProperties.tokenId);
    const decimals = balanceDetails[idx].decimal ?? 0;

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

  const checkAmount = () => {
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

        // sendTip will open a pop-up from polkadot.js extension,
        // tx signing is done by supplying a password
        setSenderAddress(userAddress);

        setSendTipClicked(true);
      }
    } else {
      handleInputError();
    }
  };

  const handleCloseModal = () => {
    handleClearValue();
    hide();
    setSendTipClicked(false);
  };

  const sendTipWithPayload = ({
    from,
    to,
    value,
    decimals,
    currencyId,
    referenceId,
    contentType,
    wsAddress,
  }: SendTipProps) => {
    const sendTipPayload = {
      from,
      to,
      value,
      decimals,
      currencyId,
      referenceId,
      contentType,
      wsAddress,
    };

    sendTip(sendTipPayload, () => {
      handleCloseModal();
      setSendTipClicked(false);

      const contentPayload = posts.find(({id}) => id === recipientDetail.referenceId);

      if (contentPayload) {
        openTipSummary(contentPayload);
      }
    });
  };

  const dispatchSendTip = () => {
    sendTipWithPayload({
      from: senderAddress,
      to: recipientDetail.walletAddress,
      value: tipAmount,
      decimals: tokenProperties.tokenDecimals,
      currencyId: tokenProperties.tokenId,
      referenceId: recipientDetail.referenceId,
      contentType: recipientDetail.contentType,
      wsAddress: tokenProperties.wsAddress,
    });
  };

  const handleChange = (prop: keyof InputState, event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [prop]: event.target.value});
  };

  const handleSendTip = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    checkAmount();
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

  if (!isShown) return null;

  return (
    <>
      <Dialog open={isShown} aria-labelledby="send-tips-window" maxWidth="md">
        <DialogTitle id="name" onClose={handleCloseModal}>
          Send Tip
        </DialogTitle>
        <DialogContent dividers>
          <CurrencyTableComponent
            balanceDetails={balanceDetails}
            isLoading={loadingBalance}
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
            disabled={disabled || loading}
            onClick={e => handleSendTip(e)}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop className={styles.backdrop} open={isSignerLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export default SendTipModal;
