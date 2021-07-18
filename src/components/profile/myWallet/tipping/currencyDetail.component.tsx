import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade, createStyles, withStyles, Theme } from '@material-ui/core/styles';

const useStylesForCurrencyDetails = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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
    },
    tooltipContentHeader: {
      fontWeight: 'bold'
    },
    tooltipContentRoot: { display: 'flex', flexDirection: 'column' },
    buttonContainer: {
      justifyContent: 'center',
      display: 'flex'
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.45),
        color: '#fff'
      },
      '&:active': {
        backgroundColor: '#fff',
        color: theme.palette.primary.main
      }
    },
    green: {
      color: '#4caf50'
    },
    red: {
      color: '#f44336'
    }
  })
);

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
    paddingTop: 3,
    paddingBottom: 3
  }
})(MuiTableCell);

export const CurrencyDetails = () => {
  const style = useStylesForCurrencyDetails();

  function createData(currency: string, balance: string) {
    return { currency, balance };
  }

  const rows = [createData('Total received', '+82.31'), createData('Total sent', '-12.4123')];

  return (
    <TableContainer>
      <Table size="small" aria-label="balance-table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography className={style.balanceText}>ACA</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography className={style.balanceText}>20</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.currency}>
              <TableCell component="th" scope="row">
                <Typography className={style.balanceText}>{row.currency}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography className={row.currency === 'Total received' ? style.green : style.red}>{row.balance}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
