import { useState } from 'react';

import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useComment = (content: number) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    limit: 20,
    skip: 0,
    include: ['user'],
    where: {
      contentId: content
    }
  });

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await axios({
        url: '/comments',
        method: 'GET',
        params: {
          query: params
        }
      });

      setComments(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setParams({
      ...params,
      skip: (params.skip + 1) * params.limit
    });
    load();
  };

  return {
    error,
    loading,
    comments,
    loadInitComment: load,
    loadMoreComment: loadMore
  };
};
