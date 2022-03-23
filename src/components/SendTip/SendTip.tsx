import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import Backdrop from '@material-ui/core/Backdrop';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MaterialUILink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {useStyles, TableCell, StyledTooltip} from '.';
import {BalanceDetail} from '../../interfaces/balance';
import {RootState} from '../../reducers';
import {TimelineState} from '../../reducers/timeline/reducer';
import {UserState} from '../../reducers/user/reducer';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {Button, ButtonVariant} from '../atoms/Button';
import {CurrencyOptionComponent} from '../atoms/CurrencyOption';
import {ListItemComponent} from '../atoms/ListItem';

import {InfoIcon} from 'src/components/atoms/Icons';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {WalletState} from 'src/reducers/wallet/reducer';

type SendTipProps = {
  balanceDetails: BalanceDetail[];
  tippedUserId: string;
  tippedUser?: {
    name: string;
    profilePictureURL: string;
  };
};

//TODO: split this component into sub-components
export const SendTip: React.FC<SendTipProps> = ({balanceDetails, tippedUser, tippedUserId}) => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {tippedContent} = useSelector<RootState, TimelineState>(state => state.timelineState);
  const {fee} = useSelector<RootState, WalletState>(state => state.walletState);

  const {getEstimatedFee, isFetchingFee, isSignerLoading} = usePolkadotApi();

  const [tipAmount, setTipAmount] = useState('');
  const [verifiedTipAmount, setVerifiedTipAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<BalanceDetail>(balanceDetails[0]);
  const [checked, setChecked] = useState(false);
  const [lengthError, setLengthError] = useState(false);

  const digitLengthLimit = 10;

  if (!user) return null;

  useEffect(() => {
    verifyTipAmount(tipAmount);
  }, [tipAmount]);

  const [openSigner, setOpenSigner] = useState(false);

  useEffect(() => {
    if (openSigner) {
      handleSendTip();
    }
  }, [openSigner]);

  useEffect(() => {
    if (tippedUserId.length > 0) {
      if (user && user.wallets && user.wallets.length >= 0) {
        getEstimatedFee(user.wallets[0].id, tippedUserId, selectedCurrency);
      }
    }
  }, [selectedCurrency, tippedUserId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const classes = useStyles();

  const checkNotEmpty = (input: string) => {
    if (input === '') {
      return '';
    }

    return input;
  };

  const checkValidDigits = (input: string) => {
    const regexValidDigits = /^(?:[1-9]\d*|0(?!(?:\.0+)?$))?(?:\.\d+)?$/; // any number in the world, no leading zeros, no 0.0

    if (regexValidDigits.test(input)) {
      return input;
    }

    return '';
  };

  const parseEstimatedFee = (estimatedFee: string | null, selectedCurrency: BalanceDetail) => {
    let amount: number | null = null;

    const {decimal} = selectedCurrency;
    amount = Number(estimatedFee) / 10 ** decimal;
    return amount;
  };

  const setMaxTippable = () => {
    const maxTippable =
      selectedCurrency.freeBalance - Number(parseEstimatedFee(fee, selectedCurrency) ?? '0.01');
    return maxTippable;
  };

  const checkEnoughBalance = (input: string) => {
    if (setMaxTippable() > Number(input)) {
      return input;
    }
    return '';
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const input = e.target.value;
    if (input.length <= 10) {
      setTipAmount(input);
    }
  };

  const checkTipLength = (tipAmount: string) => {
    if (tipAmount.length > digitLengthLimit) {
      setLengthError(true);
    } else {
      setLengthError(false);
    }
  };

  const verifyTipAmount = (tipAmount: string) => {
    const nonZeroLengthString = checkNotEmpty(tipAmount);

    const validDigits = checkValidDigits(nonZeroLengthString.length > 0 ? nonZeroLengthString : '');

    const validBalanceAmount = checkEnoughBalance(validDigits.length > 0 ? validDigits : '');

    if (validBalanceAmount.length > 0) {
      checkTipLength(validBalanceAmount);
      setVerifiedTipAmount(validBalanceAmount);
    } else {
      setVerifiedTipAmount('');
    }
  };

  const handleSendTip = () => {
    // if (tippedContent.contentType.length > 0) {
    //   const sendTipForContentPayload = {
    //     from: user.id,
    //     to: tippedUserId,
    //     type: tippedContent.contentType,
    //     referenceId: tippedContent.referenceId,
    //     amount: Number(verifiedTipAmount),
    //     currency: selectedCurrency,
    //   };
    //   simplerSendTip(sendTipForContentPayload);
    // } else {
    //   const sendTipDirectToUserPayload = {
    //     from: user.id,
    //     to: tippedUserId,
    //     amount: Number(verifiedTipAmount),
    //     currency: selectedCurrency,
    //   };
    //   simplerSendTip(sendTipDirectToUserPayload);
    // }

    setOpenSigner(false);
  };

  const triggerSignTransactionWithExtension = () => {
    setOpenSigner(true);
  };

  if (!tippedUser || (tippedUserId.length === 0 && !tippedUserId)) {
    return (
      <Backdrop
        className={classes.backdrop}
        open={!tippedUser || (tippedUserId.length === 0 && !tippedUserId)}>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  return (
    <Paper className={classes.root}>
      {tippedUser && (
        <>
          <div className={classes.subHeaderSection}>
            <Grid container spacing={1} style={{alignItems: 'center'}}>
              <Grid item>
                <Typography className={classes.subHeader}>Balance</Typography>
              </Grid>
              <Grid item>
                <StyledTooltip
                  PopperProps={{keepMounted: true}}
                  interactive
                  placement="right"
                  disableFocusListener
                  disableTouchListener
                  enterDelay={500}
                  leaveDelay={1500}
                  title={
                    <Typography>
                      If the receiver's balance is below the existential deposit after the tipping
                      was done, the account will be reaped.{' '}
                      <MaterialUILink
                        color="secondary"
                        variant="inherit"
                        target="_blank"
                        href="https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-"
                        rel="noopener noreferrer">
                        Read more
                      </MaterialUILink>
                    </Typography>
                  }>
                  <IconButton style={{backgroundColor: 'transparent', padding: 1}}>
                    <InfoIcon />
                  </IconButton>
                </StyledTooltip>
              </Grid>
            </Grid>
            <ListItemComponent
              avatar={selectedCurrency.image}
              title={selectedCurrency.id}
              subtitle={parseFloat(selectedCurrency.freeBalance.toFixed(4))}
              action={
                <CurrencyOptionComponent
                  onSelect={setSelectedCurrency}
                  balanceDetails={balanceDetails}
                  isOtherTippingCurrencyDisabled={tippedContent.disableOtherTippingCurrencies}
                />
              }
            />
            <form className={classes.formRoot} autoComplete="off">
              <TextField
                className={classes.formInput}
                id="send-tip-amount"
                aria-label="send-tip-amount"
                label="Tip amount"
                value={tipAmount}
                onChange={handleChangeAmount}
                type="number"
                variant="outlined"
                inputProps={{min: 0}}
                error={
                  (Number(tipAmount) > setMaxTippable() && !isSignerLoading) || lengthError
                    ? true
                    : false
                }
                helperText={
                  lengthError
                    ? '10 char maximum'
                    : Number(tipAmount) > setMaxTippable() && !isSignerLoading
                    ? 'Insufficient balance'
                    : checkValidDigits(tipAmount) === ''
                    ? 'Digits only'
                    : ''
                }
              />
              <div className={classes.receiverSummary}>
                <Avatar
                  src={String(tippedUser.profilePictureURL)}
                  name={tippedUser.name}
                  size={AvatarSize.TINY}
                />
                <Typography variant="subtitle2" className={classes.text}>
                  {tippedUser.name ?? `Unnamed Myrian`} will receive{' '}
                  <span className={classes.clickableText}>
                    {tipAmount} {selectedCurrency.id}
                  </span>{' '}
                </Typography>
              </div>
              <div style={{marginTop: 30, width: '100%'}}>
                <Typography className={classes.subHeader}>Tip Summary</Typography>
                <TableContainer>
                  <Table size="small" aria-label="tip summary table">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" classes={{root: classes.table}}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Tip
                          </Typography>
                        </TableCell>
                        <TableCell align="right" classes={{root: classes.table}}>
                          <Typography variant="subtitle2" color="textPrimary">
                            {tipAmount.length === 0 ? '-' : tipAmount} {selectedCurrency.id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" classes={{root: classes.table}}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Estimated gas fee
                          </Typography>
                        </TableCell>
                        <TableCell align="right" classes={{root: classes.table}}>
                          <Typography variant="subtitle2" color="textSecondary">
                            {isFetchingFee ? (
                              <Typography>Loading</Typography>
                            ) : fee ? (
                              parseEstimatedFee(fee, selectedCurrency).toFixed(10) +
                              ` ${selectedCurrency.id}`
                            ) : (
                              `0.01 ${selectedCurrency.id}`
                            )}{' '}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row" classes={{root: classes.table}}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Total
                          </Typography>
                        </TableCell>
                        <TableCell align="right" classes={{root: classes.table}}>
                          <Typography className={classes.subHeader} variant="subtitle2">
                            <span className={classes.clickableText}>
                              {isFetchingFee ? (
                                <Typography>Loading</Typography>
                              ) : (
                                Number(
                                  (
                                    Number(tipAmount) +
                                    Number(parseEstimatedFee(fee, selectedCurrency) ?? '0.01')
                                  ).toFixed(digitLengthLimit),
                                ).toString()
                              )}{' '}
                              {isFetchingFee ? '' : selectedCurrency.id}
                            </span>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className={classes.formControls}>
                <FormControlLabel
                  control={
                    <Checkbox
                      className={classes.checkBox}
                      checked={checked}
                      onChange={handleChange}
                      name="check-tipping-agreement"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="subtitle2">
                      I agree to the Myriad{' '}
                      <Link href="/term-of-use">
                        <a
                          href="/term-of-use"
                          target="_blank"
                          rel="noreferrer"
                          className={classes.clickableText}>
                          Terms of Service
                        </a>
                      </Link>{' '}
                      about Tipping
                    </Typography>
                  }
                />
                <Button
                  className={classes.button}
                  isDisabled={verifiedTipAmount.length === 0 || !checked || lengthError}
                  variant={ButtonVariant.CONTAINED}
                  onClick={triggerSignTransactionWithExtension}>
                  Send my tips
                </Button>
              </div>
            </form>
            <div className={classes.formStreak} />
          </div>
          <Backdrop className={classes.backdrop} open={isSignerLoading}>
            <CircularProgress color="primary" />
          </Backdrop>
        </>
      )}
    </Paper>
  );
};

export default SendTip;
