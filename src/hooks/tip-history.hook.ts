import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {TransactionSort} from 'src/interfaces/transaction';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {
  fetchTransactionHistory,
  setTransactionCurrency,
  setTransactionSort,
} from 'src/reducers/tip-summary/actions';
import {TipSummaryState} from 'src/reducers/tip-summary/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useTipHistory = (reference: Post | Comment | User, referenceType: ReferenceType) => {
  const dispatch = useDispatch();

  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const {availableCurrencies} = useSelector<RootState, ConfigState>(state => state.configState);
  const {
    transactions,
    hasMore,
    meta: {currentPage},
  } = useSelector<RootState, TipSummaryState>(state => state.tipSummaryState);
  const disabled = user?.id === reference?.id;

  const handleSortTransaction = useCallback((sort: TransactionSort) => {
    dispatch(setTransactionSort(sort));

    dispatch(fetchTransactionHistory(reference, referenceType));
  }, []);

  const handleFilterTransaction = useCallback((currency: string) => {
    dispatch(setTransactionCurrency(currency));

    dispatch(fetchTransactionHistory(reference, referenceType));
  }, []);

  const handleLoadNextPage = useCallback(() => {
    dispatch(fetchTransactionHistory(reference, referenceType, currentPage + 1));
  }, []);

  return {
    hasMore,
    disabled,
    currencies,
    availableCurrencies,
    transactions,
    handleSortTransaction,
    handleFilterTransaction,
    handleLoadNextPage,
  };
};
