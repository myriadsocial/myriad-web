import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {HistoryDetailList} from './HistoryDetailList';

import {useTransaction} from 'src/hooks/use-transaction.hooks';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const HistoryDetailListContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {transactions, inboundTxs, outboundTxs, loadTransactions} = useTransaction();

  if (!user) return null;

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <HistoryDetailList
      userId={user.id}
      allTxs={transactions}
      inboundTxs={inboundTxs}
      outboundTxs={outboundTxs}
    />
  );
};
