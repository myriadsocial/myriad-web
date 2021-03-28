// @ts-nocheck
import { useState } from 'react';

import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useTopic = () => {
  const [topics, setTopic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params] = useState({
    limit: 20,
    skip: 0
  });

  const search = async (query: string) => {
    setLoading(true);

    try {
      const { data } = await axios({
        url: '/tags',
        method: 'GET',
        params: {
          filter: {
            ...params,
            where: {
              id: {
                like: query
              }
            }
          }
        }
      });
      setTopic(data.map(i => i.id));
    } catch (error) {
      console.log('search error', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    topics,
    search
  };
};
