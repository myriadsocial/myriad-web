import { useState } from 'react';

import { useTransaction as baseUseTransaction, TransactionActionType } from './transaction.context';

import Axios from 'axios';
//import { omit } from 'lodash';
import { Transaction } from 'src/interfaces/transaction';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useTransaction = () => {
  const { state, dispatch } = baseUseTransaction();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, _] = useState({
    offset: 0,
    limit: 100,
    where: {},
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
      dispatch({
        type: TransactionActionType.INIT_TRANSACTION,
        transactions: data.map(transaction => {
          return {
            ...transaction
          };
        })
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    loadInitTransaction: load
  };
};
