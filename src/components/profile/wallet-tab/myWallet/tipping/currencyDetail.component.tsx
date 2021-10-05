import React, {useState, useEffect} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {makeStyles, fade, createStyles, withStyles, Theme} from '@material-ui/core/styles';

import {BalanceDetail} from 'src/interfaces/balance';
import {UserTransactionDetail} from 'src/interfaces/user';

const useStylesForCurrencyDetails = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(2),
      color: '#E0E0E0',
    },
    title: {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontSize: 24,
    },
    subtitle: {
      textTransform: 'uppercase',
      fontSize: 12,
    },
    gutters: {
      border: `1px solid`,
      borderColor: '#A942E9',
      borderRadius: 8,
      marginBottom: theme.spacing(1),
    },
    icon: {
      minWidth: 40,
    },
    showText: {
      width: '100%',
      padding: '2px',
      fontWeight: 600,
    },
    balanceText: {
      width: '100%',
      padding: '2px',
      fontWeight: 700,
    },
    errorText: {
      color: 'red',
    },
    container: {
      width: '100%',
      backgroundColor: 'transparent',
      position: 'relative',
      margin: '0 4px',
    },
    spinner: {
      color: '#A942E9',
      left: '4px',
      top: '2px',
      position: 'relative',
    },
    tooltipContentHeader: {
      fontWeight: 'bold',
    },
    tooltipContentRoot: {display: 'flex', flexDirection: 'column'},
    buttonContainer: {
      justifyContent: 'center',
      display: 'flex',
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.45),
        color: '#fff',
      },
      '&:active': {
        backgroundColor: '#fff',
        color: theme.palette.primary.main,
      },
    },
    green: {
      color: '#4caf50',
    },
    red: {
      color: '#f44336',
    },
  }),
);

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
    paddingTop: 3,
    paddingBottom: 3,
  },
})(MuiTableCell);

interface Props {
  userTransactionDetail: UserTransactionDetail;
  balanceDetail: BalanceDetail;
}

interface CurrencyObj {
  currencyId: string;
  sent: number;
  received: number;
}

export const CurrencyDetails = ({userTransactionDetail, balanceDetail}: Props) => {
  const [currencyDetail, setCurrencyDetail] = useState<CurrencyObj>({
    sent: 0,
    received: 0,
    currencyId: '',
  });
  const style = useStylesForCurrencyDetails();

  useEffect(() => {
    const temp = getCommonTransactionDetail(userTransactionDetail, balanceDetail);
    if (temp) {
      setCurrencyDetail({
        ...currencyDetail,
        sent: temp.sent,
        received: temp.received,
        currencyId: temp.currencyId,
      });
    }
  }, [balanceDetail]);

  const getCommonTransactionDetail = (
    userTransactionDetail: UserTransactionDetail,
    balanceDetail: BalanceDetail,
  ) => {
    const result = {
      sent: 0,
      received: 0,
      currencyId: balanceDetail.id,
    };

    const receivedObj = userTransactionDetail.received.find(({currencyId}) => {
      return currencyId === balanceDetail.id;
    });

    const sentObj = userTransactionDetail.sent.find(({currencyId}) => {
      return currencyId === balanceDetail.id;
    });

    if (receivedObj) {
      result.received = receivedObj.amount;
    }

    if (sentObj) {
      result.sent = sentObj.amount;
    }

    return result;
  };

  if (!currencyDetail) {
    return <Typography>Data not available</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small" aria-label="balance-table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography className={style.balanceText}>{balanceDetail.id}</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={style.balanceText}>{balanceDetail.freeBalance}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={`${currencyDetail.currencyId}-received`}>
            <TableCell component="th" scope="row">
              <Typography className={style.balanceText}>Total Received:</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={style.green}>{currencyDetail.received}</Typography>
            </TableCell>
          </TableRow>
          <TableRow key={`${currencyDetail.currencyId}-sent`}>
            <TableCell component="th" scope="row">
              <Typography className={style.balanceText}>Total Sent:</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={style.red}>{currencyDetail.sent}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
