import { useState } from 'react';

import Axios from 'axios';
import { Post } from 'src/interfaces/post';
import { Transaction } from 'src/interfaces/transaction';
import * as PostAPI from 'src/lib/api/post';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

interface PostAddress {
  walletAddress: string;
}

export const useTransactionHistory = () => {
  const [postDetail, setPostDetail] = useState<Post | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [params, _] = useState({
    offset: 0,
    limit: 20,
    include: ['fromUser']
  });

  const loadPostDetail = async (post: Post) => {
    const detail = await PostAPI.getPostDetail(post.id);

    setPostDetail(detail);
  };

  const loadTransaction = async (post: Post) => {
    let filter = params;

    setLoading(true);

    try {
      await loadPostDetail(post);

      const {
        data: { walletAddress }
      } = await axios.request<PostAddress>({
        url: `/posts/${post.id}/walletaddress`,
        method: 'GET'
      });

      const { data } = await axios.request<Transaction[]>({
        url: '/transactions',
        method: 'GET',
        params: {
          filter: {
            ...filter,
            where: {
              to: walletAddress,
              postId: post.id
            }
          }
        }
      });

      if (data.length > 0) {
        setTransactions(data);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    error,
    loading,
    postDetail,
    transactions,
    loadTransaction
  };
};
