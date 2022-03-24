import React, {useEffect, useState} from 'react';

import {Backdrop, CircularProgress} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {BN, BN_ZERO} from '@polkadot/util';

import {TermOfService} from '../TermOfService';
import {SendTipProps} from './Tipping.interface';
import {useStyles} from './Tipping.style';
import {TippingInfo} from './render/Info';
import {InputAmount} from './render/InputAmount';
import {Summary} from './render/Summary';

import {Button, ButtonVariant} from 'src/components/atoms/Button';
import {CurrencyOptionComponent} from 'src/components/atoms/CurrencyOption';
import {ListItemComponent} from 'src/components/atoms/ListItem';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {BalanceDetail} from 'src/interfaces/balance';
import {CurrencyId} from 'src/interfaces/currency';
import {ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';

const INITIAL_AMOUNT = new BN(-1);

export const Tipping: React.FC<SendTipProps> = props => {
  const {sender, receiver, reference, referenceType, balances, onSuccess} = props;

  const classes = useStyles();
  const {isSignerLoading, simplerSendTip, getEstimatedFee} = usePolkadotApi();

  const [amount, setAmount] = useState<BN>(INITIAL_AMOUNT);
  const [transactionFee, setTransactionFee] = useState<BN>(INITIAL_AMOUNT);
  const [currency, setCurrency] = useState<BalanceDetail>(balances[0]);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [disableExternalCurrency, setDisableExternalCurrency] = useState(false);
  const [feeLoaded, setFeeLoaded] = useState(false);

  useEffect(() => {
    // disable other currencies when tipping to unclaimed imported posts
    if (
      referenceType === 'post' &&
      'people' in reference &&
      reference.people &&
      !('userSocialMedia' in reference.people)
    ) {
      const enabledCurrency = balances.find(balance => balance.id === CurrencyId.MYRIA);

      if (enabledCurrency) {
        setCurrency(enabledCurrency);
        handleChangeCurrency(enabledCurrency);
      }

      setDisableExternalCurrency(true);
    } else {
      if (balances.length) {
        handleChangeCurrency(balances[0]);
      }
    }
  }, []);

  const getAddressByUser = (user: User) => {
    return user.wallets.length ? user.wallets[0].id : null;
  };

  const getReceiverAddress = (): string | null => {
    if ('originUserId' in receiver) {
      return receiver.walletAddress ?? null;
    } else {
      return getAddressByUser(receiver);
    }
  };

  const handleChangeAgreement = (accepted: boolean) => {
    setAgreementChecked(accepted);
  };

  const handleChangeCurrency = async (currency: BalanceDetail) => {
    setCurrency(currency);

    const receiverAddress = getReceiverAddress();
    const senderAddress = getAddressByUser(sender);

    if (!receiverAddress || !senderAddress) return;

    setFeeLoaded(false);
    const fee = await getEstimatedFee(senderAddress, receiverAddress, currency);
    setFeeLoaded(true);

    if (fee) {
      setTransactionFee(fee);
    }

    setAmount(INITIAL_AMOUNT);
  };

  const handleAmountChange = (amount?: BN) => {
    if (amount) {
      setAmount(amount);
    }
  };

  const signTransaction = () => {
    if (amount.lte(BN_ZERO)) return;

    const receiverAddress = getReceiverAddress();
    const senderAddress = getAddressByUser(sender);

    if (!receiverAddress || !senderAddress) return;

    const attributes = {
      from: senderAddress,
      to: receiverAddress,
      amount,
      currency,
    };

    // not direct tipping
    if ([ReferenceType.POST, ReferenceType.COMMENT].includes(referenceType)) {
      Object.assign(attributes, {
        type: referenceType,
        referenceId: reference.id,
      });
    }

    simplerSendTip(attributes, hash => {
      onSuccess(currency, hash, attributes.amount);

      setAmount(INITIAL_AMOUNT);
      setTransactionFee(INITIAL_AMOUNT);
    });
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.subHeaderSection}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography className={classes.subHeader}>Balance</Typography>
          </Grid>
          <Grid item>
            <TippingInfo />
          </Grid>
        </Grid>

        <ListItemComponent
          avatar={currency.image}
          title={currency.id}
          subtitle={parseFloat(currency.freeBalance.toFixed(4))}
          action={
            <CurrencyOptionComponent
              onSelect={handleChangeCurrency}
              balanceDetails={balances}
              isOtherTippingCurrencyDisabled={disableExternalCurrency}
            />
          }
        />
        <form className={classes.formRoot} autoComplete="off">
          <InputAmount
            placeholder="Tip Amount"
            decimal={currency.decimal}
            maxValue={currency.freeBalance}
            onChange={handleAmountChange}
          />

          <Summary
            amount={amount}
            transactionFee={transactionFee}
            receiver={receiver}
            currency={currency}
            loadingFee={false}
          />

          <div className={classes.formControls}>
            <TermOfService about="Tipping" onChange={handleChangeAgreement} />

            <Button
              isDisabled={!agreementChecked || amount.lte(BN_ZERO) || !feeLoaded}
              variant={ButtonVariant.CONTAINED}
              onClick={signTransaction}>
              Send my tips
            </Button>
          </div>
        </form>
      </div>

      <Backdrop className={classes.backdrop} open={isSignerLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Paper>
  );
};

export default Tipping;
