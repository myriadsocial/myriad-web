import {useState} from 'react';

import Axios from 'axios';
import {Post} from 'src/interfaces/post';
import {Transaction} from 'src/interfaces/transaction';
import * as PostAPI from 'src/lib/api/post';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000',
});

type useTransactionHistoryProps = {
  error: string | null;
  loading: boolean;
  postDetail: Post | null;
  transactions: Transaction[];
  loadTransaction: (post: Post) => void;
};

export const useTransactionHistory = (): useTransactionHistoryProps => {
  const [postDetail, setPostDetail] = useState<Post | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [params] = useState({
    offset: 0,
    limit: 20,
    include: ['fromUser'],
  });

  const loadPostDetail = async (post: Post): Promise<void> => {
    const detail = await PostAPI.getPostDetail(post.id);

    setPostDetail(detail);
  };

  const loadTransaction = async (post: Post): Promise<void> => {
    const filter = params;

    setLoading(true);

    try {
      const {data} = await axios.request<Transaction[]>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter: {
            ...filter,
            where: {
              postId: post.id,
            },
          },
        },
      });

      if (data.length > 0) {
        setTransactions(data);

        await loadPostDetail(post);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    postDetail,
    transactions,
    loadTransaction,
  };
};
