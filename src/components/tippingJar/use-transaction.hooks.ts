import { useState } from 'react';

import { useTransaction as baseUseTransaction, TransactionActionType } from './transaction.context';

import Axios from 'axios';
import { Transaction } from 'src/interfaces/transaction';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useTransaction = (userId: string) => {
  const { state, dispatch } = baseUseTransaction();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, _] = useState({
    offset: 0,
    limit: 20,
    where: { or: [{ to: userId }, { from: userId }] },
    include: ['toUser', 'fromUser']
  });

  const load = async (type: TransactionActionType = TransactionActionType.INIT_TRANSACTION) => {
    let filter = params;

    setLoading(true);

    try {
      console.log('fetching transactions');
      const { data } = await axios.request<Transaction[]>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter
        }
      });

      if (data.length > 0) {
        //Get only transaction related to logged-in user
        let tempData = data.filter(function (datum: any) {
          return datum.from === userId || datum.to === userId;
        });

        const sortedTempData = tempData.slice().sort((a: any, b: any) => b.createdAt - a.createdAt);
        const inboundTxs = sortedTempData.filter(transaction => {
          return transaction.to === userId;
        });
        const outboundTxs = sortedTempData.filter(transaction => {
          return transaction.from === userId;
        });

        console.log('data: ', data);

        dispatch({
          type: TransactionActionType.INIT_TRANSACTION,
          transactions: sortedTempData,
          inboundTxs: inboundTxs,
          outboundTxs: outboundTxs
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
    loadInitTransaction: load
  };
};
