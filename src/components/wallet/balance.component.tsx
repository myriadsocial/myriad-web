import React, { useState, useEffect, useImperativeHandle } from 'react';

import { useSession } from 'next-auth/client';

import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';

const useStyles = makeStyles((theme: Theme) =>
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
    tooltipContentRoot: { display: 'flex', flexDirection: 'column' }
  })
);

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
    paddingTop: 3,
    paddingBottom: 3
  }
})(MuiTableCell);

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -5,
      top: 0
    }
  })
)(Badge);

interface BalanceProps {
  forwardedRef: React.ForwardedRef<any>;
}

const BalanceComponent: React.FC<BalanceProps> = ({ forwardedRef }) => {
  const style = useStyles();

  const [session] = useSession();
  const userAddress = session?.user.address as string;

  const { loading, error, tokens, load } = usePolkadotApi();

  useEffect(() => {
    if (userAddress) {
      load(userAddress);
    }
  }, [userAddress]);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      setIsHidden(false);
      //loadInitBalance();
    }
  }));

  const [isHidden, setIsHidden] = useState(true);
  const handleIsHidden = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHidden(!isHidden);
  };

  const TooltipContent = () => {
    return (
      <div className={style.tooltipContentRoot}>
        <Typography className={style.tooltipContentHeader}>Myria</Typography>{' '}
        <Typography>A reward token you earn by sending a tip to a post you think is valuable.</Typography>
      </div>
    );
  };

  const StyledTooltip = () => {
    return (
      <Tooltip title={<TooltipContent />} placement="right" aria-label="myria-token-info">
        <InfoIcon fontSize="small" />
      </Tooltip>
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
            {tokens.map(row => (
              <TableRow key={row.tokenSymbol}>
                <TableCell component="th" scope="row">
                  <Typography className={style.balanceText}>
                    {row.tokenSymbol === 'MYRIA' ? (
                      <>
                        {' '}
                        <StyledBadge badgeContent={<StyledTooltip />}>MYRIA</StyledBadge>
                      </>
                    ) : (
                      row.tokenSymbol
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {isHidden ? (
                    <Button onClick={handleIsHidden}>Show balance</Button>
                  ) : loading ? (
                    <CircularProgress className={style.spinner} size={20} />
                  ) : error ? (
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
    </div>
  );
};

export default BalanceComponent;
