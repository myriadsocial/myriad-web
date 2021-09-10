import React, {useState} from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {useStyles, TableCell} from '.';
import {ListItemComponent} from '../atoms/ListItem/';
import {CustomAvatar, CustomAvatarSize} from '../atoms/avatar/';
import {Button, ButtonVariant} from '../atoms/button/';

//TODO: split this component into sub-components
export const SendTip = (): JSX.Element => {
  const [tipAmount, setTipAmount] = useState('');
  const classes = useStyles();

  const changeCurrency = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    console.log('changing currency!');
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const input = e.target.value;
    console.log(input);
    //TODO: tipAmount input validation goes here
    setTipAmount(input);
  };

  const handleSendTip = () => {
    console.log('sending tip!');
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
          avatar={'https://res.cloudinary.com/dsget80gs/coins/aca.svg'}
          title={'ACA'}
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
            value={tipAmount}
            onChange={handleChangeAmount}
            variant="outlined"
          />
          <div className={classes.receiverSummary}>
            <CustomAvatar
              avatar={
                'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg'
              }
              size={CustomAvatarSize.XSMALL}
            />
            <Typography variant="body1">
              King Lion will receive <span className={classes.clickableText}>0.70 ACA</span>{' '}
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
                        0.70 ACA
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
                        0.01 ACA
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
                        <span className={classes.clickableText}>0.71 ACA</span>
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
                        12 Myria
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className={classes.formControls}>
            <FormControlLabel
              control={<Checkbox name="check-tipping-agreement" color="primary" />}
              label={
                <Typography>
                  I agree to the Myriad{' '}
                  <span className={classes.clickableText}>Terms of Service</span> about Tipping
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
