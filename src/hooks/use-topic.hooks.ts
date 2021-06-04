// @ts-nocheck
import { useState } from 'react';

import Axios from 'axios';
import { Tag } from 'src/interfaces/experience';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useTopic = () => {
  const [topics, setTopic] = useState<Tag[]>([]);
  const [popularTopics, setPopularTopic] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params] = useState({
    limit: 10,
    skip: 0
  });

  const loadPopularTopic = async () => {
    setLoading(true);

    try {
      const { data } = await axios.request<Tag[]>({
        url: '/tags',
        method: 'GET',
        params: {
          filter: {
            ...params
          }
        }
      });

      setPopularTopic(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopic = async () => {
    setLoading(true);

    try {
      const { data } = await axios.request<Tag[]>({
        url: '/tags',
        method: 'GET',
        params: {
          filter: {
            ...params
          }
        }
      });

      setTopic(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const searchTopic = async (query: string) => {
    setLoading(true);

    try {
      const { data } = await axios.request<Tag[]>({
        url: '/tags',
        method: 'GET',
        params: {
          filter: {
            ...params,
            where: {
              id: {
                like: `.*${query}*`,
                options: 'i'
              }
            }
          }
        }
      });

      setTopic(data);
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
    popularTopics,
    loadPopularTopic,
    loadTopic,
    searchTopic
  };
};
