// @ts-nocheck
import { useState } from 'react';

import Axios from 'axios';
import { People } from 'src/interfaces/experience';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const usePeople = () => {
  const [people, setPeople] = useState<People[]>([]);
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
        url: '/people',
        method: 'GET',
        params: {
          filter: {
            ...params,
            where: {
              username: {
                like: query
              }
            }
          }
        }
      });

      setPeople(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    people,
    search
  };
};
