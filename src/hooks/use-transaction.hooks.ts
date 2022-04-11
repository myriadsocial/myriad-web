import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {TransactionOrderType} from 'src/interfaces/transaction';
import {RootState} from 'src/reducers';
import {
  fetchTransactions,
  setTransactionFilter,
  setTransactionSort,
  TransactionFilterProps,
} from 'src/reducers/transaction/actions';
import {TransactionState} from 'src/reducers/transaction/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useTransaction = () => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {transactions, meta, filter} = useSelector<RootState, TransactionState>(
    state => state.transactionState,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (page?: number) => {
    const currentPage = page ? page : 1;
    if (!user) return;

    setLoading(true);

    try {
      dispatch(fetchTransactions(currentPage));
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const filterTransaction = async (filter: TransactionFilterProps) => {
    await dispatch(setTransactionFilter(filter));

    loadTransactions();
  };

  const sortTransaction = async (sort: TransactionOrderType) => {
    await dispatch(setTransactionSort(sort));

    loadTransactions();
  };

  return {
    error,
    loading,
    meta,
    hasMore: meta.currentPage < meta.totalPageCount,
    filter,
    transactions,
    loadTransactions,
    filterTransaction,
    sortTransaction,
  };
};
