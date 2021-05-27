import React, { useState, useEffect, useImperativeHandle } from 'react';

import { useSession } from 'next-auth/client';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';

import { useBalance } from '../wallet/use-balance.hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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

const TableCell = withStyles({
  root: {
    borderBottom: 'none'
  }
})(MuiTableCell);

interface BalanceProps {
  forwardedRef: React.ForwardedRef<any>;
}

const BalanceComponent: React.FC<BalanceProps> = ({ forwardedRef }) => {
  const style = useStyles();

  const [session] = useSession();
  const userAddress = session?.user.address as string;
  const { loading, error, freeBalance, loadInitBalance } = useBalance(userAddress);

  useEffect(() => {
    loadInitBalance();
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      setIsHidden(false);
      loadInitBalance();
    }
  }));

  const [isHidden, setIsHidden] = useState(true);
  const handleIsHidden = () => {
    setIsHidden(!isHidden);
  };

  function createData(currency: string, balance: number) {
    return { currency, balance };
  }

  const rows = [createData('MYRIA', freeBalance), createData('ACA', 100)];

  const CurrencyTable = () => {
    return (
      <TableContainer>
        <Table aria-label="balance-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography className={style.balanceText}>Currency</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography className={style.balanceText}>Balance</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.currency}>
                <TableCell component="th" scope="row">
                  <Typography className={style.balanceText} onClick={handleIsHidden}>
                    {row.currency}
                  </Typography>
                </TableCell>
                <TableCell align="right">
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
                      {row.balance}
                    </Typography>
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
    <div ref={forwardedRef} className={style.root}>
      <CurrencyTable />
    </div>
  );
};

export default BalanceComponent;
