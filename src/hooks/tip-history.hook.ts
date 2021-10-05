import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Comment} from 'src/interfaces/comment';
import {CurrencyId} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {TransactionSort} from 'src/interfaces/transaction';
import {RootState} from 'src/reducers';
import {
  fetchTransactionHistory,
  clearTippedContent,
  setTransactionCurrency,
  setTransactionSort,
} from 'src/reducers/tip-summary/actions';
import {TipSummaryState} from 'src/reducers/tip-summary/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useTipHistory = () => {
  const dispatch = useDispatch();

  const {currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {transactions} = useSelector<RootState, TipSummaryState>(state => state.tipSummaryState);
  const [tipHistoryReference, setTipHistoryReference] = useState<Comment | Post | null>(null);
  const isTipHistoryOpen = Boolean(tipHistoryReference);

  const openTipHistory = (reference: Comment | Post) => {
    dispatch(fetchTransactionHistory(reference, 'comment'));

    setTipHistoryReference(reference);
  };

  const closeTipHistory = () => {
    setTipHistoryReference(null);
    dispatch(clearTippedContent());
  };

  const handleSortTransaction = (sort: TransactionSort) => {
    dispatch(setTransactionSort(sort));

    if (tipHistoryReference) {
      dispatch(fetchTransactionHistory(tipHistoryReference, 'comment'));
    }
  };

  const handleFilterTransaction = (currency: CurrencyId) => {
    dispatch(setTransactionCurrency(currency));

    if (tipHistoryReference) {
      dispatch(fetchTransactionHistory(tipHistoryReference, 'comment'));
    }
  };

  return {
    isTipHistoryOpen,
    tipHistoryReference,
    currencies,
    transactions,
    openTipHistory,
    closeTipHistory,
    handleSortTransaction,
    handleFilterTransaction,
  };
};
