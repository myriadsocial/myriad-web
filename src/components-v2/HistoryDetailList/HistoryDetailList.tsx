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

type HistoryDetailListProps = {
  allTxs: Transaction[];
  outboundTxs: Transaction[];
  inboundTxs: Transaction[];
  userId: string;
};

export const HistoryDetailList: React.FC<HistoryDetailListProps> = props => {
  const {allTxs, userId} = props;

  useEffect(() => {
    const newArray = allTxs.map(tx => ({
      id: tx.currency.name,
      title: tx.currency.name,
    }));
    const updatedSortOptions = getUniqueListBy(newArray, 'id');

    //@ts-ignore
    setSortOptions((oldSortOptions: MenuOptions[]) => [...oldSortOptions, ...updatedSortOptions]);
  }, []);

  const [sortOptions, setSortOptions] = useState(historyCoinSortOptions);

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const getUniqueListBy = (arr: Array<any>, key: string) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  };

  const handleSortChange = (sort: string) => {
    // code
  };

  const handleTransactionChange = (sort: string) => {
    // code
  };

  const handleCoinChange = (coin: string) => {
    // code
  };

  const classes = useStyles();
  return (
    <>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu
          title={'Sort'}
          options={historyAmountSortOptions}
          onChange={handleSortChange}
        />
        <div className={classes.leftJustifiedWrapper}>
          <DropdownMenu title={'Coin'} options={sortOptions} onChange={handleCoinChange} />
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
                      20 seconds ago
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
                          +{tx.amount} {tx.currency.name}
                        </Typography>
                      )}
                      {tx.fromUser.id === userId && (
                        <Typography variant="h5" className={classes.textAmountRed}>
                          -{tx.amount} {tx.currency.name}
                        </Typography>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        {'~15.25 USD'}
                      </Typography>
                    </div>
                    <div>
                      <CustomAvatar
                        size={CustomAvatarSize.XSMALL}
                        alt={tx.currency.name}
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
