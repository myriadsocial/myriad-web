import {RefreshIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';

import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import SvgIcon from '@material-ui/core/SvgIcon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {useStyles} from '.';
import {BalanceDetail} from '../../interfaces/balance';
import {PrimaryCoinMenuContainer} from '../PrimaryCoinMenu/PrimaryCoinMenuContainer';
import {balanceSortOptions} from '../Timeline/default';
import {Button, ButtonVariant, ButtonColor} from '../atoms/Button';
import {DropdownMenu} from '../atoms/DropdownMenu/';

import _ from 'lodash';

type BalanceDetailListProps = {
  balanceDetails: BalanceDetail[];
  isLoading: boolean;
  onClickRefresh: () => void;
  onClickAddCoin: () => void;
};

export const BalanceDetailList: React.FC<BalanceDetailListProps> = props => {
  const {balanceDetails, isLoading, onClickRefresh, onClickAddCoin} = props;

  // Make sure balance is showing, does not return empty JSX
  useEffect(() => {
    setDefaultBalanceDetails(balanceDetails);
  }, [balanceDetails]);

  const [isOnPrimaryCoinMenu, setIsOnPrimaryCoinMenu] = useState(false);
  const [defaultBalanceDetails, setDefaultBalanceDetails] = useState<BalanceDetail[]>([]);

  const handleSortChanged = (sort: string) => {
    switch (sort) {
      case 'aToZ': {
        const sortedAtoZBalances = _.sortBy(defaultBalanceDetails, 'name');
        setDefaultBalanceDetails(sortedAtoZBalances);
        break;
      }

      case 'highest': {
        const sortedHighestBalances = _.orderBy(defaultBalanceDetails, 'freeBalance', 'desc');
        setDefaultBalanceDetails(sortedHighestBalances);
        break;
      }

      case 'lowest': {
        const sortedLowestBalances = _.orderBy(defaultBalanceDetails, 'freeBalance', 'asc');
        setDefaultBalanceDetails(sortedLowestBalances);
        break;
      }

      default: {
        break;
      }
    }
  };

  const togglePrimaryCoinMenu = () => {
    setIsOnPrimaryCoinMenu(!isOnPrimaryCoinMenu);
  };

  const classes = useStyles();

  if (isOnPrimaryCoinMenu)
    return (
      <>
        <PrimaryCoinMenuContainer togglePrimaryCoinMenu={togglePrimaryCoinMenu} />
      </>
    );

  return (
    <>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu title={'Sort'} options={balanceSortOptions} onChange={handleSortChanged} />
        <IconButton
          classes={{
            root: classes.refreshIcon,
          }}
          disableRipple
          aria-label="refresh"
          onClick={onClickRefresh}>
          <SvgIcon component={RefreshIcon} color="primary" />
          <Typography variant="body1" color="primary">
            Refresh
          </Typography>
        </IconButton>
      </div>
      <TableContainer component={List}>
        <Table className={classes.root} aria-label="Balance Detail Table">
          <TableBody>
            {isLoading && defaultBalanceDetails.length === 0 && (
              <TableRow className={classes.loading}>
                <CircularProgress />
              </TableRow>
            )}
            {!isLoading &&
              defaultBalanceDetails.length > 0 &&
              defaultBalanceDetails.map(balanceDetail => (
                <TableRow key={balanceDetail.id} className={classes.tableRow}>
                  <TableCell component="th" scope="row" className={classes.tableCell}>
                    <Avatar alt={balanceDetail.id} src={balanceDetail.image} />
                    <Typography variant="h5" color="textPrimary">
                      {balanceDetail.id}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <div>
                      <Typography variant="body1" style={{fontWeight: 'bold'}}>
                        {balanceDetail.freeBalance}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {'USD 15.25'}
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.balanceTabActions}>
        <Button
          variant={ButtonVariant.OUTLINED}
          color={ButtonColor.SECONDARY}
          onClick={togglePrimaryCoinMenu}>
          Set coin priority
        </Button>
        <Button onClick={onClickAddCoin} variant={ButtonVariant.CONTAINED}>
          + Add coin
        </Button>
      </div>
    </>
  );
};
