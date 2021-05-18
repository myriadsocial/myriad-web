// @ts-nocheck
import { useState } from 'react';

import Axios from 'axios';
import { Tag } from 'src/interfaces/experience';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useTopic = (currentTopics: Tag[]) => {
  const [topics, setTopic] = useState<Tag[]>([]);
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
                like: `.*${query}*`,
                nin: currentTopics.map(i => i.id),
                options: 'i'
              }
            }
          }
        }
      });

      setTopic(
        data.map(i => ({
          id: i.id,
          hide: i.hide
        }))
      );
    } catch (error) {
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
