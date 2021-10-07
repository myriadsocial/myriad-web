import React, {useState, useEffect} from 'react';

import Link from 'next/link';

import Checkbox from '@material-ui/core/Checkbox';
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
import {BalanceDetail} from '../../interfaces/balance';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';
import {Button, ButtonVariant} from '../atoms/Button';
import {CurrencyOptionComponent} from '../atoms/CurrencyOption/';
import {ListItemComponent} from '../atoms/ListItem/';

type SendTipProps = {
  balanceDetails: BalanceDetail[];
  tippedUserId: string;
};

//TODO: split this component into sub-components
export const SendTip: React.FC<SendTipProps> = ({balanceDetails, tippedUserId}) => {
  const [tipAmount, setTipAmount] = useState('');
  const [verifiedTipAmount, setVerifiedTipAmount] = useState('');

  useEffect(() => {
    verifyTipAmount(tipAmount);
  }, [tipAmount]);

  useEffect(() => {
    handleSendTip(tippedUserId);
  }, [tippedUserId]);

  const [gasFee] = useState('0.01');

  const [checked, setChecked] = useState(true);

  const [selectedCurrency, setSelectedCurrency] = useState<BalanceDetail>(balanceDetails[0]);

  const [url] = useState('https://myriad.social/');

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
    const regexValidDigits = /^\d*(\.\d+)?$/;

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
      console.log('Insufficient balance');
    }
  };

  const handleSendTip = (tippedUserId: string) => {
    console.log({verifiedTipAmount, tippedUserId});
    // call api along with the payload here
  };

  return (
    <Paper className={classes.root}>
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
              avatar={
                'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg'
              }
              size={CustomAvatarSize.XSMALL}
            />
            <Typography variant="body1">
              King Lion will receive{' '}
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
                          {`${Number(tipAmount) + Number(gasFee)}`} {selectedCurrency.id}
                        </span>
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1" color="textSecondary">
                        Tip Reward
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" color="textPrimary">
                        1 Myria
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
            <Button variant={ButtonVariant.CONTAINED} onClick={handleSendTip}>
              Send my tip
            </Button>
          </div>
        </form>
        <div className={classes.formStreak}></div>
      </div>
    </Paper>
  );
};
