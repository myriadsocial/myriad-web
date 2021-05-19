// @ts-nocheck
import { useState } from 'react';

import Axios from 'axios';
import { User } from 'src/interfaces/user';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useMyriadUser = () => {
  const [users, setUser] = useState<User[]>([]);
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
        url: '/users',
        method: 'GET',
        params: {
          filter: {
            ...params,
            where: {
              name: {
                like: query
              }
            }
          }
        }
      });

      setUser(
        data.map(i => ({
          id: i.id,
          name: i.name,
          profilePictureURL: i.profilePictureURL,
          anonymous: i.anonymous,
          bio: i.bio,
          createdAt: i.createdAt
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
    users,
    search
  };
};
