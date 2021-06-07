// @ts-nocheck
import { useState } from 'react';

import Axios from 'axios';
import { User } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';

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
      const users = await UserAPI.search(query);

      setUser(users);
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
