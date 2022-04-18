import React from 'react';

import {TipHistory} from './TipHistory';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

type TipHistoryContainerProps = {
  referenceType: ReferenceType;
};

export const TipHistoryContainer: React.FC<TipHistoryContainerProps> = props => {
  const {referenceType} = props;

  const {
    isTipHistoryOpen,
    hasMore,
    reference,
    tippingDisabled,
    currencies,
    transactions,
    closeTipHistory,
    handleFilterTransaction,
    handleSortTransaction,
    handleLoadNextPage,
  } = useTipHistory();

  return (
    <TipHistory
      reference={reference as Post | Comment}
      referenceType={referenceType}
      open={isTipHistoryOpen}
      hasMore={hasMore}
      currencies={currencies}
      tippingDisabled={tippingDisabled}
      tips={transactions.filter(tx => Boolean(tx.currency))}
      onClose={closeTipHistory}
      onSort={handleSortTransaction}
      onFilter={handleFilterTransaction}
      nextPage={handleLoadNextPage}
    />
  );
};

export default TipHistoryContainer;
