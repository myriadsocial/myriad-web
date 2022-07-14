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

  const isTippingDisabled = useCallback((): boolean => {
    // disable tipping to own comment
    if ('section' in reference) {
      return user?.id === reference.userId;
    }

    // disable tipping to own profile
    if ('username' in reference) {
      return user?.id === reference.id;
    }

    // disable tipping on owned post
    if ('platform' in reference) {
      const isPostCreator = reference.createdBy === user?.id;
      const isInternalPost = reference.platform === 'myriad';
      const isOriginOwner = user?.people?.find(person => person.id === reference.peopleId)
        ? true
        : false;

      const isPostOwner = isInternalPost ? isPostCreator : isOriginOwner;

      return isPostOwner;
    }

    return false;
  }, [reference, user]);

  const handleSortTransaction = useCallback(
    (sort: TransactionSort) => {
      dispatch(setTransactionSort(sort));

      dispatch(fetchTransactionHistory(reference, referenceType));
    },
    [reference, referenceType],
  );

  const handleFilterTransaction = useCallback(
    (currency: string) => {
      dispatch(setTransactionCurrency(currency));

      dispatch(fetchTransactionHistory(reference, referenceType));
    },
    [reference, referenceType],
  );

  const initHistory = useCallback(() => {
    dispatch(fetchTransactionHistory(reference, referenceType, 1));
  }, [reference, referenceType]);

  const handleLoadNextPage = useCallback(() => {
    dispatch(fetchTransactionHistory(reference, referenceType, currentPage + 1));
  }, [reference, referenceType]);

  return {
    hasMore,
    currencies,
    availableCurrencies,
    transactions,
    isTippingDisabled,
    handleSortTransaction,
    handleFilterTransaction,
    handleLoadNextPage,
    initHistory,
  };
};
