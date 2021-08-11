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
  hasMore: boolean;
  postDetail: Post | null;
  transactions: Transaction[];
  loadTransaction: (post: Post, page?: number) => void;
  loadNextTransaction: (post: Post) => void;
};

export const useTransactionHistory = (): useTransactionHistoryProps => {
  const [postDetail, setPostDetail] = useState<Post | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: 10,
  });
  const [params] = useState({
    include: ['fromUser'],
    order: `createdAt DESC`,
  });

  const loadPostDetail = async (post: Post): Promise<void> => {
    const detail = await PostAPI.getPostDetail(post.id);

    setPostDetail(detail);
  };

  const loadNextTransaction = async (post: Post): Promise<void> => {
    const {page} = paginationMeta;

    if (!loading) {
      await loadTransaction(post, page + 1);
    }
  };

  const loadTransaction = async (post: Post, page?: number): Promise<void> => {
    const filter = params;
    const currentPage = page ? page : paginationMeta.page;

    setLoading(true);

    try {
      const {data} = await axios.request<Transaction[]>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter: {
            ...filter,
            limit: paginationMeta.limit,
            offset: (currentPage - 1) * paginationMeta.limit,
            where: {
              postId: post.id,
            },
          },
        },
      });

      setPaginationMeta(prevMeta => ({
        ...prevMeta,
        page: currentPage,
      }));

      setHasMore(data.length >= 10);

      if (data.length > 0) {
        setTransactions(prevTransaction => [...prevTransaction, ...data]);

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
    hasMore,
    postDetail,
    transactions,
    loadTransaction,
    loadNextTransaction,
  };
};
