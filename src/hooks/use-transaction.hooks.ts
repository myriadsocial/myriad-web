import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from 'src/reducers';
import {fetchTransactions} from 'src/reducers/transaction/actions';
import {fetchTransactionsIncludingCurrency} from 'src/reducers/transaction/actions';
import {TransactionState} from 'src/reducers/transaction/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useTransaction = () => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {transactions, inboundTxs, outboundTxs} = useSelector<RootState, TransactionState>(
    state => state.transactionState,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!user) return;

    setLoading(true);

    try {
      dispatch(fetchTransactions());
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const loadTransactionsWithCurrency = async () => {
    if (!user) return;

    setLoading(true);

    try {
      dispatch(fetchTransactionsIncludingCurrency());
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    error,
    loading,
    transactions: transactions,
    inboundTxs: inboundTxs,
    outboundTxs: outboundTxs,
    loadInitTransaction: load,
    loadTransactions: loadTransactionsWithCurrency,
  };
};
