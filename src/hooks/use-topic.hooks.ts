import {useState} from 'react';

import getConfig from 'next/config';

import Axios from 'axios';
import {Tag} from 'src/interfaces/experience';
import * as TrendingAPI from 'src/lib/api/trending';

const {publicRuntimeConfig} = getConfig();

const axios = Axios.create({
  baseURL: publicRuntimeConfig.apiURL,
});

export const useTopic = () => {
  const [topics, setTopic] = useState<Tag[]>([]);
  const [popularTopics, setPopularTopic] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params] = useState({
    limit: 10,
    skip: 0,
  });

  const loadPopularTopic = async (): Promise<void> => {
    setLoading(true);

    try {
      const data = await TrendingAPI.trendingTopic();

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
      const {data} = await axios.request<Tag[]>({
        url: '/tags',
        method: 'GET',
        params: {
          filter: {
            ...params,
          },
        },
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
      const {data} = await axios.request<Tag[]>({
        url: '/tags',
        method: 'GET',
        params: {
          filter: {
            ...params,
            where: {
              id: {
                like: `.*${query}*`,
                options: 'i',
              },
            },
          },
        },
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
    searchTopic,
  };
};
