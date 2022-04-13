import React, {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {MenuOptions} from '../atoms/DropdownMenu';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {Empty} from '../atoms/Empty';
import ShowIf from '../common/show-if.component';
import {useStyles} from './HistoryDetailList.styles';
import {transactionSortOptions, transactionStatusOptions} from './default';

import {Loading} from 'src/components/atoms/Loading';
import {formatUsd} from 'src/helpers/balance';
import {timeAgo} from 'src/helpers/date';
import {parseScientificNotatedNumber} from 'src/helpers/number';
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {Currency} from 'src/interfaces/currency';
import {NetworkTypeEnum} from 'src/interfaces/network';
import {Transaction, TransactionOrderType} from 'src/interfaces/transaction';
import {UserWallet} from 'src/interfaces/user';
import {TransactionFilterProps} from 'src/reducers/transaction/actions';

type HistoryDetailListProps = {
  transactions: Transaction[];
  filter: TransactionFilterProps;
  orderType: TransactionOrderType;
  hasMore: boolean;
  currencies: Currency[];
  wallet: UserWallet;
  isLoading: boolean;
  userId: string;
  nextPage: () => void;
  filterTransaction: (filter: TransactionFilterProps) => void;
  sortTransaction: (sort: TransactionOrderType) => void;
};

const DEFAULT_NAME = 'Unknown Myrian';

export const HistoryDetailList: React.FC<HistoryDetailListProps> = props => {
  const {
    isLoading,
    transactions,
    wallet,
    currencies,
    filter,
    orderType,
    hasMore,
    userId,
    nextPage,
    filterTransaction,
    sortTransaction,
  } = props;

  const classes = useStyles();
  const {loading, exchangeRates} = useExchangeRate();

  const [selectedSort, setSelectedSort] = useState(orderType);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(filter.currencyId ?? 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>(
    filter?.from ? 'sent' : filter.to ? 'received' : 'all',
  );

  const currencyOptions: MenuOptions<string>[] = [
    {id: 'all', title: 'All'},
    ...currencies.map(item => ({
      id: item.id,
      title: item.symbol,
    })),
  ];

  //TODO: create new component with conversion
  const getConversion = (currencyId: string) => {
    if (loading) {
      return 0;
    }

    const found = exchangeRates.find(exchangeRate => exchangeRate.id === currencyId);

    if (found) return found.price;
    return 0;
  };

  const handleSortTransaction = (sort: TransactionOrderType) => {
    setSelectedSort(sort);
    sortTransaction(sort);
  };

  const handleFilterTransactionStatus = (status: string) => {
    setSelectedStatus(status);

    switch (status) {
      case 'received': {
        filterTransaction({
          ...filter,
          to: wallet.id,
          from: undefined,
        });
        break;
      }

      case 'sent': {
        filterTransaction({
          ...filter,
          from: wallet.id,
          to: undefined,
        });
        break;
      }

      default: {
        filterTransaction({
          ...filter,
          from: undefined,
          to: undefined,
        });
        break;
      }
    }
  };

  const handleCurrencyChange = (currencyId: string) => {
    setSelectedCurrency(currencyId);

    if (currencyId === 'all') {
      filterTransaction({
        ...filter,
        currencyId: undefined,
      });
    } else {
      filterTransaction({
        ...filter,
        currencyId,
      });
    }
  };

  return (
    <>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu<TransactionOrderType>
          title={'Sort'}
          selected={selectedSort}
          options={transactionSortOptions}
          onChange={handleSortTransaction}
        />
        <DropdownMenu
          title={'Coin'}
          selected={selectedCurrency}
          options={currencyOptions}
          onChange={handleCurrencyChange}
        />
        <DropdownMenu
          title={'Transaction'}
          selected={selectedStatus}
          options={transactionStatusOptions}
          onChange={handleFilterTransactionStatus}
        />
      </div>

      <ShowIf condition={transactions.length === 0 && !isLoading}>
        <Empty title="You don't have any transaction" subtitle="Start to send tips in a post!" />
      </ShowIf>

      <TableContainer component={List}>
        <Table className={classes.root} aria-label="history details table">
          <TableBody>
            {transactions.length === 0 && isLoading ? (
              <TableRow className={classes.loading}>
                <CircularProgress />
              </TableRow>
            ) : (
              <InfiniteScroll
                dataLength={transactions.length}
                hasMore={hasMore}
                next={nextPage}
                loader={<Loading />}
                className={classes.infiniteScroll}>
                {transactions.length > 0 &&
                  transactions.map(tx => (
                    <a
                      key={tx.id}
                      style={{textDecoration: 'none'}}
                      //TODO: moved parsing for href to BE
                      href={
                        tx.currency.network.id === NetworkTypeEnum.NEAR
                          ? `${tx.currency.network.explorerURL}/transactions/${tx.hash}`
                          : `${tx.currency.network.explorerURL}/${tx.hash}`
                      }
                      target="_blank"
                      rel="noopener noreferrer">
                      <TableRow key={tx.id} className={classes.tableRow}>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          <Avatar
                            size={AvatarSize.MEDIUM}
                            alt={
                              tx.toWallet?.userId === userId
                                ? tx.fromWallet?.userId
                                : tx.toWallet?.userId
                            }
                            src={
                              tx.toWallet?.userId === userId
                                ? tx.fromWallet?.user.profilePictureURL ?? DEFAULT_NAME
                                : tx.toWallet?.user.profilePictureURL ?? DEFAULT_NAME
                            }
                            name={
                              tx.toWallet?.userId === userId
                                ? tx.fromWallet?.user.name ?? DEFAULT_NAME
                                : tx.toWallet?.user.name ?? DEFAULT_NAME
                            }
                          />

                          <div>
                            <Typography variant="body1">
                              {tx.toWallet?.userId === userId
                                ? tx.fromWallet?.user.name ?? DEFAULT_NAME
                                : tx.toWallet?.user.name ?? DEFAULT_NAME}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {timeAgo(tx.createdAt)}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          {tx.toWallet?.userId === userId && (
                            <div className={classes.received}>
                              <Typography variant="caption">Received</Typography>
                            </div>
                          )}
                          {tx.fromWallet?.userId === userId && (
                            <div className={classes.sent}>
                              <Typography variant="caption">Sent</Typography>
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <div className={classes.currencyDetailWrapper}>
                            <div>
                              {tx.toWallet?.userId === userId && (
                                <Typography variant="h5" className={classes.textAmountReceived}>
                                  {parseScientificNotatedNumber(+tx.amount)} {tx.currency.name}
                                </Typography>
                              )}
                              {tx.fromWallet?.userId === userId && (
                                <Typography variant="h5" className={classes.textAmountSent}>
                                  {parseScientificNotatedNumber(+tx.amount)} {tx.currency.name}
                                </Typography>
                              )}
                              <Typography variant="caption" color="textSecondary">
                                {`~${formatUsd(tx.amount, getConversion(tx.currencyId))} USD`}
                              </Typography>
                            </div>
                            <div>
                              <Avatar
                                name={tx.currency.name}
                                size={AvatarSize.TINY}
                                alt={tx.currency.name}
                                src={tx.currency.image}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </a>
                  ))}
              </InfiniteScroll>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
