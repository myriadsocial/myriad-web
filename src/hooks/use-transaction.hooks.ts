import {useState} from 'react';
import {useSelector} from 'react-redux';

import Axios from 'axios';
import {
  useTransaction as baseUseTransaction,
  TransactionActionType,
} from 'src/context/transaction.context';
import {Transaction} from 'src/interfaces/transaction';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const useTransaction = () => {
  const {state, dispatch} = baseUseTransaction();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params] = useState<Record<string, any>>({
    offset: 0,
    include: ['toUser', 'fromUser', 'token'],
  });

  const load = async (type: TransactionActionType = TransactionActionType.INIT_TRANSACTION) => {
    if (!user) return;

    setLoading(true);

    try {
      const {data} = await axios.request<Transaction[]>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter: {
            ...params,
            where: {or: [{to: user.id}, {from: user.id}]},
          },
        },
      });

      if (data.length > 0) {
        //Get only transaction related to logged-in user
        const tempData = data.filter(function (datum: any) {
          return datum.from === user.id || datum.to === user.id;
        });

        const sortedTempData = tempData.slice().sort((a: any, b: any) => b.createdAt - a.createdAt);
        const inboundTxs = sortedTempData.filter(transaction => {
          return transaction.to === user.id;
        });
        const outboundTxs = sortedTempData.filter(transaction => {
          return transaction.from === user.id;
        });

        dispatch({
          type: TransactionActionType.INIT_TRANSACTION,
          transactions: sortedTempData,
          inboundTxs: inboundTxs,
          outboundTxs: outboundTxs,
        });
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    error,
    loading,
    transactions: state.transactions,
    inboundTxs: state.inboundTxs,
    outboundTxs: state.outboundTxs,
    loadInitTransaction: load,
  };
};
