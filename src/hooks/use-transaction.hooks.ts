import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from 'src/reducers';
import {setError} from 'src/reducers/base/actions';
import {fetchTransactions} from 'src/reducers/transaction/actions';
import {fetchTransactionsIncludingCurrency} from 'src/reducers/transaction/actions';
import {TransactionState} from 'src/reducers/transaction/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useTransaction = () => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {transactions, inboundTxs, outboundTxs, meta} = useSelector<RootState, TransactionState>(
    state => state.transactionState,
  );
  const [loading, setLoading] = useState(false);

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

  const loadTransactionsWithCurrency = async (page?: number) => {
    const currentPage = page ? page : 1;
    if (!user) return;

    setLoading(true);

    try {
      dispatch(fetchTransactionsIncludingCurrency(currentPage));
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    loading,
    meta,
    transactions: transactions,
    inboundTxs: inboundTxs,
    outboundTxs: outboundTxs,
    loadInitTransaction: load,
    loadTransactions: loadTransactionsWithCurrency,
  };
};
