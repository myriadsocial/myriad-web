import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import Link from 'next/link';

import Backdrop from '@material-ui/core/Backdrop';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {useStyles, TableCell} from '.';
import {usePolkadotApi} from '../../hooks/use-polkadot-api.hook';
import {BalanceDetail} from '../../interfaces/balance';
import {RootState} from '../../reducers/';
import {TimelineState} from '../../reducers/timeline/reducer';
import {UserState} from '../../reducers/user/reducer';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';
import {Button, ButtonVariant} from '../atoms/Button';
import {CurrencyOptionComponent} from '../atoms/CurrencyOption/';
import {ListItemComponent} from '../atoms/ListItem/';

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

  const {simplerSendTip, isSignerLoading} = usePolkadotApi();

  const [tipAmount, setTipAmount] = useState('');
  const [verifiedTipAmount, setVerifiedTipAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<BalanceDetail>(balanceDetails[0]);
  //TODO: fetch gas fee using api
  const [gasFee] = useState('0.01');
  const [checked, setChecked] = useState(false);
  const [url] = useState('https://myriad.social/');

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

  const setMaxTippable = () => {
    const maxTippable = selectedCurrency.freeBalance - Number(gasFee);
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
    setTipAmount(input);
  };

  const verifyTipAmount = (tipAmount: string) => {
    const nonZeroLengthString = checkNotEmpty(tipAmount);

    const validDigits = checkValidDigits(nonZeroLengthString.length > 0 ? nonZeroLengthString : '');

    const validBalanceAmount = checkEnoughBalance(validDigits.length > 0 ? validDigits : '');

    if (validBalanceAmount.length > 0) {
      setVerifiedTipAmount(validBalanceAmount);
    } else {
      setVerifiedTipAmount('');
    }
  };

  const handleSendTip = () => {
    if (tippedContent.contentType.length > 0) {
      const sendTipForContentPayload = {
        from: user.id,
        to: tippedUserId,
        type: tippedContent.contentType,
        referenceId: tippedContent.referenceId,
        amount: Number(verifiedTipAmount),
        currency: selectedCurrency,
      };
      simplerSendTip(sendTipForContentPayload);
    } else {
      const sendTipDirectToUserPayload = {
        from: user.id,
        to: tippedUserId,
        amount: Number(verifiedTipAmount),
        currency: selectedCurrency,
      };
      simplerSendTip(sendTipDirectToUserPayload);
    }

    setOpenSigner(false);
  };

  const triggerSignTransactionWithExtension = () => {
    setOpenSigner(true);
  };

  if (!tippedUser)
    return (
      <Backdrop className={classes.backdrop} open={!tippedUser}>
        <CircularProgress color="primary" />
      </Backdrop>
    );

  return (
    <Paper className={classes.root}>
      {tippedUser && (
        <>
          <div className={classes.subHeaderSection}>
            <Typography className={classes.subHeader}>Balance</Typography>
            <ListItemComponent
              avatar={selectedCurrency.image}
              title={selectedCurrency.id}
              subtitle={selectedCurrency.freeBalance}
              action={
                <CurrencyOptionComponent
                  onSelect={setSelectedCurrency}
                  balanceDetails={balanceDetails}
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
                onInput={e => {
                  const InputElement = e.target as HTMLInputElement;
                  InputElement.value = Math.max(0, parseFloat(InputElement.value))
                    .toString()
                    .slice(0, digitLengthLimit);
                }}
                type="number"
                variant="outlined"
                error={Number(tipAmount) > setMaxTippable() ? true : false}
                helperText={
                  Number(tipAmount) > setMaxTippable()
                    ? 'Insufficient balance'
                    : checkValidDigits(tipAmount) === ''
                    ? 'Digits only'
                    : ''
                }
              />
              <div className={classes.receiverSummary}>
                <CustomAvatar
                  avatar={String(tippedUser.profilePictureURL)}
                  name={tippedUser.name}
                  size={CustomAvatarSize.XSMALL}
                />
                <Typography variant="body1">
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
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="body1" color="textSecondary">
                            Tip
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" color="textPrimary">
                            {tipAmount.length === 0 ? '-' : tipAmount} {selectedCurrency.id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="body1" color="textSecondary">
                            Gas fee
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" color="textSecondary">
                            {gasFee} {selectedCurrency.id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="body1" color="textSecondary">
                            Total
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography className={classes.subHeader}>
                            <span className={classes.clickableText}>
                              {Number(
                                (Number(tipAmount) + Number(gasFee)).toFixed(digitLengthLimit),
                              ).toString()}{' '}
                              {selectedCurrency.id}
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
                    <Typography>
                      I agree to the Myriad{' '}
                      <Link href={url}>
                        <a
                          href={url}
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
                  isDisabled={verifiedTipAmount.length === 0 || !checked}
                  variant={ButtonVariant.CONTAINED}
                  onClick={triggerSignTransactionWithExtension}>
                  Send my tips
                </Button>
              </div>
            </form>
            <div className={classes.formStreak}></div>
          </div>
          <Backdrop className={classes.backdrop} open={isSignerLoading}>
            <CircularProgress color="primary" />
          </Backdrop>
        </>
      )}
    </Paper>
  );
};
