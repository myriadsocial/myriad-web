// @ts-nocheck
import { useState, useEffect } from 'react';

import Axios from 'axios';
import { User } from 'src/interfaces/user';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useProfileHook = user => {
  console.log('useProfileHook', user)
  const [profile, setProfile] = useState<User>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params] = useState({
    limit: 20,
    skip: 0
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoading(true);

    try {
      const { data } = await MyriadAPI({
        url: `/users/${user.address}`,
        method: 'GET'
      });
      console.log('setProfile', {
        ...profile,
        ...data
      })
      setProfile({
        ...profile,
        ...data
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (attributes: Partial<User>) => {
    setLoading(true);

    try {
      const { data } = await MyriadAPI({
        url: `/users/${user.address}`,
        method: 'PATCH',
        data: attributes
      });

      setProfile({
        ...profile,
        ...attributes
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    profile,
    updateProfile
  };
};
