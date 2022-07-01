import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {TransactionSort} from 'src/interfaces/transaction';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
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
  const {availableCurrencies} = useSelector<RootState, ConfigState>(state => state.configState);
  const {
    transactions,
    reference,
    tippingDisabled,
    hasMore,
    meta: {currentPage},
  } = useSelector<RootState, TipSummaryState>(state => state.tipSummaryState);
  const isTipHistoryOpen = Boolean(reference);

  const getReferenceType = (reference: Comment | Post | User): string => {
    if ('username' in reference) return 'user';

    if ('section' in reference) return 'comment';

    return 'post';
  };

  const openTipHistory = useCallback((reference: Comment | Post | User) => {
    const type = getReferenceType(reference);

    if ('username' in reference) {
      if ((user && user.id === reference.id) || !user) dispatch(setDisableTipping(true));
    }

    if ('section' in reference || 'platform' in reference) {
      if ((user && user.id === reference.user.id) || !user) dispatch(setDisableTipping(true));
    }

    dispatch(setTippedReference(reference));
    dispatch(fetchTransactionHistory(reference, type));
  }, []);

  const closeTipHistory = useCallback(() => {
    dispatch(clearTippedContent());
  }, []);

  const handleSortTransaction = useCallback((sort: TransactionSort) => {
    dispatch(setTransactionSort(sort));

    if (reference) {
      const type = getReferenceType(reference);

      dispatch(fetchTransactionHistory(reference, type));
    }
  }, []);

  const handleFilterTransaction = useCallback((currency: string) => {
    dispatch(setTransactionCurrency(currency));

    if (reference) {
      const type = getReferenceType(reference);

      dispatch(fetchTransactionHistory(reference, type));
    }
  }, []);

  const handleLoadNextPage = useCallback(() => {
    if (reference) {
      const type = getReferenceType(reference);

      dispatch(fetchTransactionHistory(reference, type, currentPage + 1));
    }
  }, []);

  return {
    isTipHistoryOpen,
    hasMore,
    reference,
    tippingDisabled,
    currencies,
    availableCurrencies,
    transactions,
    openTipHistory,
    closeTipHistory,
    handleSortTransaction,
    handleFilterTransaction,
    handleLoadNextPage,
  };
};
