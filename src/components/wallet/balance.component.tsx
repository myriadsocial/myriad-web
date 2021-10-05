import React, {useState, useEffect, useImperativeHandle} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useSession} from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';

import {useStyles, TableCell, StyledBadge} from './balance.style';

import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {Currency} from 'src/interfaces/currency';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';

interface BalanceProps {
  forwardedRef: React.ForwardedRef<any>;
  availableTokens: Currency[];
}

const BalanceComponent: React.FC<BalanceProps> = ({forwardedRef, availableTokens}) => {
  const {balanceDetails: tokensReady} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );
  const dispatch = useDispatch();
  const style = useStyles();

  const [session] = useSession();
  const userAddress = session?.user.address as string;

  const {loadingBalance, error, load} = usePolkadotApi();

  useEffect(() => {
    if (tokensReady.length === 0 && availableTokens.length > 0) {
      load(userAddress, availableTokens);
    }
  }, [tokensReady, availableTokens]);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      setIsHidden(false);
      dispatch(fetchBalances(userAddress, availableTokens));
      //load(userAddress, availableTokens);
    },
  }));

  const [isHidden, setIsHidden] = useState(true);
  const handleIsHidden = () => {
    setIsHidden(!isHidden);
  };

  const TooltipContent = () => {
    return (
      <div className={style.tooltipContentRoot}>
        <Typography className={style.tooltipContentHeader}>Myria</Typography>{' '}
        <Typography>
          A reward token you earn by sending a tip to a post you think is valuable.
        </Typography>
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
            {tokensReady.length === 0 && (
              <TableRow key="loading-row">
                <TableCell rowSpan={4} colSpan={2}>
                  <CircularProgress className={style.spinner} size={20} />
                </TableCell>
              </TableRow>
            )}
            {tokensReady.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className={style.tokenColumn}>
                    <Avatar alt={row.id} src={row.image} />
                    <Typography className={style.balanceText}>
                      {
                        // TODO: move to single file constant or enum
                      }
                      {row.id === 'MYRIA' ? (
                        <StyledBadge badgeContent={<StyledTooltip />}>{row.id}</StyledBadge>
                      ) : (
                        row.id
                      )}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="right">
                  {isHidden ? (
                    <Button onClick={handleIsHidden}>Show balance</Button>
                  ) : loadingBalance ? (
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
