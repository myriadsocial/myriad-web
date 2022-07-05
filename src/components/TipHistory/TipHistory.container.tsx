import React from 'react';

import {TipHistory} from './TipHistory';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

type TipHistoryContainerProps = {
  reference: Post | User | Comment;
  referenceType: ReferenceType;
  onClose: () => void;
};

export const TipHistoryContainer: React.FC<TipHistoryContainerProps> = props => {
  const {reference, referenceType, onClose} = props;

  const {
    hasMore,
    disabled,
    availableCurrencies,
    transactions,
    handleFilterTransaction,
    handleSortTransaction,
    handleLoadNextPage,
  } = useTipHistory(reference, referenceType);

  return (
    <TipHistory
      reference={reference}
      referenceType={referenceType}
      open={Boolean(reference)}
      hasMore={hasMore}
      currencies={availableCurrencies}
      tippingDisabled={disabled}
      tips={transactions.filter(tx => Boolean(tx.currency))}
      onClose={onClose}
      onSort={handleSortTransaction}
      onFilter={handleFilterTransaction}
      nextPage={handleLoadNextPage}
    />
  );
};

export default TipHistoryContainer;
