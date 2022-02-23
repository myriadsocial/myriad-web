import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {HistoryDetailList} from './HistoryDetailList';

import {useTransaction} from 'src/hooks/use-transaction.hooks';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const HistoryDetailListContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {loading, meta, transactions, inboundTxs, outboundTxs, loadTransactions} = useTransaction();

  if (!user) return null;

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleNextPage = () => {
    const page = meta.currentPage + 1;
    loadTransactions(page);
  };

  return (
    <HistoryDetailList
      userId={user.id}
      isLoading={loading}
      allTxs={transactions}
      meta={meta}
      inboundTxs={inboundTxs}
      outboundTxs={outboundTxs}
      nextPage={handleNextPage}
    />
  );
};

export default HistoryDetailListContainer;
