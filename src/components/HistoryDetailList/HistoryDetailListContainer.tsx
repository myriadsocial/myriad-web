import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {BoxComponent} from '../atoms/Box';
import {HistoryDetailList} from './HistoryDetailList';

import {useTransaction} from 'src/hooks/use-transaction.hooks';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const HistoryDetailListContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {loading, meta, transactions, inboundTxs, outboundTxs, loadTransactions} = useTransaction();

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleNextPage = () => {
    const page = meta.currentPage + 1;
    loadTransactions(page);
  };

  if (!user) return null;

  return (
    <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
      <HistoryDetailList
        userId={user.id}
        isLoading={loading}
        allTxs={transactions}
        meta={meta}
        inboundTxs={inboundTxs}
        outboundTxs={outboundTxs}
        nextPage={handleNextPage}
      />
    </BoxComponent>
  );
};

export default HistoryDetailListContainer;
