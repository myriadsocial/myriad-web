import React, {useState, useEffect} from 'react';

import List from '@material-ui/core/List';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {Transaction} from '../../interfaces/transaction';
import {
  historyAmountSortOptions,
  historyTransactionSortOptions,
  historyCoinSortOptions,
} from '../Timeline/default';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';
import {MenuOptions} from '../atoms/DropdownMenu/';
import {DropdownMenu} from '../atoms/DropdownMenu/';
import {useStyles} from './history-detail-list.styles';

import {formatDistance} from 'date-fns';
import _ from 'lodash';

type HistoryDetailListProps = {
  allTxs: Transaction[];
  outboundTxs: Transaction[];
  inboundTxs: Transaction[];
  userId: string;
};

export const HistoryDetailList: React.FC<HistoryDetailListProps> = props => {
  const {allTxs, inboundTxs, outboundTxs, userId} = props;

  useEffect(() => {
    const newArray = allTxs.map(tx => ({
      id: tx.currency.id,
      title: tx.currency.id,
    }));
    const updatedSortOptions = getUniqueListBy(newArray, 'id');

    //@ts-ignore
    setSortOptions((oldSortOptions: MenuOptions[]) => [...oldSortOptions, ...updatedSortOptions]);
  }, []);

  const [sortOptions, setSortOptions] = useState(historyCoinSortOptions);

  const [defaultTxs, setDefaultTxs] = useState(allTxs);

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const getUniqueListBy = (arr: Array<any>, key: string) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  };

  const handleSortChange = (sort: string) => {
    switch (sort) {
      case 'highestAmount': {
        const sortedHighest = _.sortBy(defaultTxs, 'amount');
        setDefaultTxs(sortedHighest);
        break;
      }

      case 'latestTransaction': {
        const sortedLatest = _.orderBy(defaultTxs, 'createdAt', 'desc');
        setDefaultTxs(sortedLatest);
        break;
      }

      default: {
        break;
      }
    }
  };

  const handleTransactionChange = (filterByTransactionDirection: string) => {
    switch (filterByTransactionDirection) {
      case 'received': {
        setDefaultTxs(inboundTxs);
        break;
      }

      case 'sent': {
        setDefaultTxs(outboundTxs);
        break;
      }

      default: {
        break;
      }
    }
  };

  const handleCurrencyChange = (filterByCurrency: string) => {
    console.log({filterByCurrency});
  };

  const classes = useStyles();

  const formatTimeAgo = (ISODate: Date) => {
    const timeAgoInString = formatDistance(new Date(ISODate), new Date(), {addSuffix: true});
    //=> "3 days ago"
    return timeAgoInString;
  };

  return (
    <>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu
          title={'Sort'}
          options={historyAmountSortOptions}
          onChange={handleSortChange}
        />
        <div className={classes.leftJustifiedWrapper}>
          <DropdownMenu title={'Coin'} options={sortOptions} onChange={handleCurrencyChange} />
          <DropdownMenu
            title={'Transaction'}
            options={historyTransactionSortOptions}
            onChange={handleTransactionChange}
          />
        </div>
      </div>
      <TableContainer component={List}>
        <Table className={classes.root} aria-label="history details table">
          <TableBody>
            {allTxs.map(tx => (
              <TableRow key={tx.id} className={classes.tableRow}>
                <TableCell component="th" scope="row" className={classes.tableCell}>
                  <CustomAvatar
                    size={CustomAvatarSize.MEDIUM}
                    alt={tx.toUser.name}
                    avatar={tx.toUser.profilePictureURL ?? ''}
                  />

                  <div>
                    <Typography variant="body1" style={{fontWeight: 'bold'}}>
                      {tx.toUser.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatTimeAgo(tx.createdAt)}
                    </Typography>
                  </div>
                </TableCell>

                <TableCell align="center">
                  {
                    //TODO: define tipStatus by checking if userId is in from or to
                  }
                  {tx.toUser.id === userId && (
                    <div className={classes.tipStatusGreen}>
                      <Typography variant="caption">Tipped</Typography>
                    </div>
                  )}
                  {tx.fromUser.id === userId && (
                    <div className={classes.tipStatusRed}>
                      <Typography variant="caption">Sent</Typography>
                    </div>
                  )}
                </TableCell>

                <TableCell align="right">
                  <div className={classes.currencyDetailWrapper}>
                    <div>
                      {tx.toUser.id === userId && (
                        <Typography variant="h5" className={classes.textAmountGreen}>
                          +{tx.amount} {tx.currency.id}
                        </Typography>
                      )}
                      {tx.fromUser.id === userId && (
                        <Typography variant="h5" className={classes.textAmountRed}>
                          -{tx.amount} {tx.currency.id}
                        </Typography>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        {'~15.25 USD'}
                      </Typography>
                    </div>
                    <div>
                      <CustomAvatar
                        size={CustomAvatarSize.XSMALL}
                        alt={tx.currency.id}
                        avatar={tx.currency.image}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
