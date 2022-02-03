import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {TipHistory} from './TipHistory';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

type TipHistoryContainerProps = {
  onSendTip: (reference: Post | Comment) => void;
};

export const TipHistoryContainer: React.FC<TipHistoryContainerProps> = props => {
  const {onSendTip} = props;

  const {
    isTipHistoryOpen,
    hasMore,
    reference,
    currencies,
    transactions,
    closeTipHistory,
    handleFilterTransaction,
    handleSortTransaction,
    handleLoadNextPage,
  } = useTipHistory();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);

  const handleSendTip = () => {
    if (reference) {
      if (user && reference.user.id !== user.id) onSendTip(reference);
    }

    closeTipHistory();
  };

  return (
    <TipHistory
      open={isTipHistoryOpen}
      hasMore={hasMore}
      currencies={currencies}
      tips={transactions}
      sendTip={handleSendTip}
      onClose={closeTipHistory}
      onSort={handleSortTransaction}
      onFilter={handleFilterTransaction}
      nextPage={handleLoadNextPage}
    />
  );
};
