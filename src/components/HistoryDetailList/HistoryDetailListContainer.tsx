import React from 'react';
import {useSelector} from 'react-redux';

import {BoxComponent} from '../atoms/Box';
import {HistoryDetailList} from './HistoryDetailList';

import {useTransaction} from 'src/hooks/use-transaction.hooks';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const HistoryDetailListContainer: React.FC = () => {
  const {user, currentWallet, currencies} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {
    loading,
    transactions,
    filter,
    orderType,
    hasMore,
    meta,
    loadTransactions,
    filterTransaction,
    sortTransaction,
  } = useTransaction();

  if (!user || !currentWallet) return null;

  const handleNextPage = () => {
    loadTransactions(meta.currentPage + 1);
  };

  return (
    <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
      <HistoryDetailList
        userId={user.id}
        currencies={currencies}
        wallet={currentWallet}
        isLoading={loading}
        transactions={transactions}
        hasMore={hasMore}
        filter={filter}
        orderType={orderType}
        nextPage={handleNextPage}
        filterTransaction={filterTransaction}
        sortTransaction={sortTransaction}
      />
    </BoxComponent>
  );
};

export default HistoryDetailListContainer;
