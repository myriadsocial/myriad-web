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
  setTippedReference,
  setDisableTipping,
} from 'src/reducers/tip-summary/actions';
import {TipSummaryState} from 'src/reducers/tip-summary/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useTipHistory = () => {
  const dispatch = useDispatch();

  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {
    transactions,
    reference,
    tippingDisabled,
    hasMore,
    meta: {currentPage},
  } = useSelector<RootState, TipSummaryState>(state => state.tipSummaryState);
  const isTipHistoryOpen = Boolean(reference);

  const openTipHistory = (reference: Comment | Post) => {
    // type guarding, post always has platform field
    const type = 'platform' in reference ? 'post' : 'comment';

    if ((user && user.id === reference.user.id) || !user) dispatch(setDisableTipping(true));

    dispatch(setTippedReference(reference));
    dispatch(fetchTransactionHistory(reference, type));
  };

  const closeTipHistory = () => {
    dispatch(clearTippedContent());
  };

  const handleSortTransaction = (sort: TransactionSort) => {
    dispatch(setTransactionSort(sort));

    if (reference) {
      const type = 'platform' in reference ? 'post' : 'comment';

      dispatch(fetchTransactionHistory(reference, type));
    }
  };

  const handleFilterTransaction = (currency: CurrencyId) => {
    dispatch(setTransactionCurrency(currency));

    if (reference) {
      const type = 'platform' in reference ? 'post' : 'comment';

      dispatch(fetchTransactionHistory(reference, type));
    }
  };

  const handleLoadNextPage = () => {
    if (reference) {
      const type = 'platform' in reference ? 'post' : 'comment';

      dispatch(fetchTransactionHistory(reference, type, currentPage + 1));
    }
  };

  return {
    isTipHistoryOpen,
    hasMore,
    reference,
    tippingDisabled,
    currencies,
    transactions,
    openTipHistory,
    closeTipHistory,
    handleSortTransaction,
    handleFilterTransaction,
    handleLoadNextPage,
  };
};
