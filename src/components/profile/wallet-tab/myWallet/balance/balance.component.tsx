import React, {useState, useEffect, useImperativeHandle} from 'react';
import {useSelector} from 'react-redux';

import {useSession} from 'next-auth/client';

import {Tooltip} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {createStyles, fade, Theme, makeStyles, withStyles} from '@material-ui/core/styles';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

const useStyles = makeStyles((theme: Theme) =>
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
      '&.Mui-disabled': {
        color: '#FFF',
      },
    },
    tokenColumn: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
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

interface BalanceProps {
  forwardedRef: React.ForwardedRef<any>;
  hidden?: boolean;
}

const BalanceComponent: React.FC<BalanceProps> = ({forwardedRef, hidden}) => {
  const {
    loading: loadingBalance,
    error: errorBalance,
    balanceDetails,
  } = useSelector<RootState, BalanceState>(state => state.balanceState);
  const {currencies} = useSelector<RootState, UserState>(state => state.userState);

  const style = useStyles();

  const [session] = useSession();
  const userAddress = session?.user.address as string;

  const {load} = usePolkadotApi();

  useEffect(() => {
    if (currencies.length > 0) {
      load(userAddress, currencies);
    }
  }, [currencies]);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      setIsHidden(false);
      load(userAddress, currencies);
    },
  }));

  const [isHidden, setIsHidden] = useState(true);
  const handleIsHidden = () => {
    setIsHidden(!isHidden);
  };

  const LoadingComponent = () => {
    return (
      <TableRow>
        <TableCell>
          <CircularProgress className={style.spinner} size={20} />
        </TableCell>
      </TableRow>
    );
  };

  const CurrencyTable = () => {
    return (
      <TableContainer>
        <Table size="small" aria-label="balance-table">
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
            {balanceDetails.length === 0 && <LoadingComponent />}
            {balanceDetails.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <div className={style.tokenColumn}>
                    <Avatar alt={row.id} src={row.image} />
                    <Typography className={style.balanceText}>{row.id}</Typography>
                  </div>
                </TableCell>
                <TableCell align="right">
                  {isHidden ? (
                    <Button onClick={handleIsHidden}>Show balance</Button>
                  ) : loadingBalance ? (
                    <CircularProgress className={style.spinner} size={20} />
                  ) : errorBalance ? (
                    <Typography className={style.errorText}>Error, try again!</Typography>
                  ) : (
                    <Button onClick={handleIsHidden}>{row.freeBalance}</Button>
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
      <div className={style.buttonContainer}>
        {!hidden && (
          <Tooltip title="Coming soon" arrow>
            <Button className={style.button}> Add more currency </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default BalanceComponent;
