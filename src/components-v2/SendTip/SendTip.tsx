import React, {useState} from 'react';

//import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

import {ListItemComponent} from '../atoms/ListItem/';
import {CustomAvatar, CustomAvatarSize} from '../atoms/avatar/';
import {Button, ButtonVariant} from '../atoms/button/';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 340,
      position: 'relative',
      height: 680,
      background: '#FFFFFF',
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,
    },
    header: {
      fontWeight: 700,
      paddingTop: 30,
      textAlign: 'center',
    },
    description: {
      textAlign: 'center',
      paddingTop: 12,
    },
    subHeader: {
      fontWeight: 700,
    },
    subHeaderSection: {
      padding: '0 8%',
      marginTop: 30,
    },
    formRoot: {
      marginTop: 12,
      textAlign: 'center',
      '& > input:nth-child(1)': {
        margin: 0,
      },
    },
    formInput: {
      zIndex: 10,
      backgroundColor: '#FFF',
    },
    formStreak: {
      content: '""',
      position: 'absolute',
      width: 340,
      height: 24,
      left: 0,
      top: 228,

      background: theme.palette.secondary.main,
    },
    receiverSummary: {
      display: 'flex',
      marginTop: 12,
      '& > *': {
        margin: 2,
      },
      '& > p': {
        padding: '2% 0',
      },
    },
    amountText: {
      color: theme.palette.primary.main,
    },
  }),
);

export const SendTip = (): JSX.Element => {
  const classes = useStyles();
  const [tipAmount, setTipAmount] = useState(0);

  const changeCurrency = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    console.log('changing currency!');
  };

  return (
    <Paper className={classes.root}>
      <Typography className={classes.header} variant="h4">
        Send Tip
      </Typography>
      <Typography className={classes.description} variant="body1">
        Finding this post is insightful? Send a tip!
      </Typography>
      <div className={classes.subHeaderSection}>
        <Typography className={classes.subHeader}>Balance</Typography>
        <ListItemComponent
          avatar={'https://res.cloudinary.com/dsget80gs/coins/ausd.png'}
          title={'AUSD'}
          subtitle={'200'}
          action={
            <Typography>
              <Link onClick={changeCurrency}>Change currency</Link>
            </Typography>
          }
        />
        <form className={classes.formRoot} autoComplete="off">
          <TextField
            className={classes.formInput}
            id="send-tip-amount"
            aria-label="send-tip-amount"
            label="Tip amount"
            variant="outlined"
          />
          <div className={classes.receiverSummary}>
            <CustomAvatar
              avatar={
                'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg'
              }
            />
            <Typography variant="body1">
              King Lion will receive <span className={classes.amountText}>0.70 ACA</span>{' '}
            </Typography>
          </div>

          <div style={{marginTop: 12}}>
            <Typography className={classes.subHeader}>Balance</Typography>
          </div>
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label={'Anonymous tipping'}
          />
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label={'I agree to the Myriad Terms of Service about Tipping'}
          />
          <Button variant={ButtonVariant.CONTAINED}>Send my tip</Button>
        </form>
        <div className={classes.formStreak}></div>
      </div>
    </Paper>
  );
};
