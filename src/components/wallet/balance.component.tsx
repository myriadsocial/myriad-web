import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/client';

import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';

import { useBalance } from '../wallet/use-balance.hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#424242',
      marginBottom: theme.spacing(2),
      color: '#E0E0E0'
    },
    title: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontSize: 24
    },
    subtitle: {
      textTransform: 'uppercase',
      fontSize: 12
    },
    gutters: {
      border: `1px solid`,
      borderColor: '#A942E9',
      borderRadius: 8,
      marginBottom: theme.spacing(1)
    },
    icon: {
      minWidth: 40
    },
    showText: {
      width: '100%',
      padding: '2px',
      fontWeight: 600
    },
    balanceText: {
      width: '100%',
      padding: '2px',
      fontWeight: 700
    },
    errorText: {
      color: 'red'
    },
    container: {
      width: '100%',
      backgroundColor: 'transparent',
      position: 'relative',
      margin: '0 4px'
    },
    spinner: {
      color: '#A942E9',
      left: '4px',
      top: '2px',
      position: 'relative'
    }
  })
);

export const BalanceComponent = React.memo(function Wallet() {
  const style = useStyles();

  const [session] = useSession();
  const userAddress = session?.user.address as string;
  const { loading, error, freeBalance, loadInitBalance } = useBalance(userAddress);

  useEffect(() => {
    loadInitBalance();
  }, []);

  const [isHidden, setIsHidden] = useState(true);
  const handleIsHidden = () => {
    setIsHidden(!isHidden);
  };

  const handleClick = () => {
    loadInitBalance();
  };

  function createData(currency: string, balance: number) {
    return { currency, balance };
  }

  const rows = [createData('MYRIA', 100)];

  const BasicTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="balance-table">
          <TableHead>
            <TableRow>
              <TableCell>Currency</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.currency}>
                <TableCell component="th" scope="row">
                  {row.currency}
                </TableCell>
                <TableCell align="right">{row.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className={style.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <BasicTable />
        </Grid>
        <Grid item>
          <Typography className={style.title} variant="h5">
            Total Balance
          </Typography>
        </Grid>
        <Grid item>
          <List>
            <ListItem button className={style.gutters}>
              <ListItemIcon className={style.icon}>
                <RefreshIcon onClick={handleClick} />
              </ListItemIcon>
              <Divider orientation="vertical" flexItem />
              <div className={style.container}>
                <ListItemText>
                  {isHidden ? (
                    <Typography className={style.showText} onClick={handleIsHidden}>
                      Show balance
                    </Typography>
                  ) : loading ? (
                    <CircularProgress className={style.spinner} size={20} />
                  ) : error ? (
                    <Typography className={style.errorText} onClick={handleIsHidden}>
                      Error, try again!
                    </Typography>
                  ) : (
                    <Typography className={style.balanceText} onClick={handleIsHidden}>
                      {freeBalance} <span className={style.subtitle}>Myria</span>
                    </Typography>
                  )}
                </ListItemText>
              </div>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
});
