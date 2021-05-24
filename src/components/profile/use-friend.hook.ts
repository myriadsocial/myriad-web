// @ts-nocheck
import { useState, useEffect } from 'react';

import Axios from 'axios';
import { FriendRequest } from 'src/interfaces/friend';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useFriendHook = user => {
  const [isSuccess, setIsSuccess] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeFriend = async (values: Partial<FriendRequest>) => {
    setLoading(true);

    try {
      const { data } = await MyriadAPI({
        url: `/users/${user.address}/friends`,
        method: 'POST',
        data: values
      });

      setIsSuccess({
        ...data
      });
      console.log('after Add friend', data);
    } catch (error) {
      setError(error);
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  const requestFriendStatus = async friendId => {
    const { data } = await MyriadAPI({
      url: `/users/${user.address}/friends`,
      method: 'GET'
    });

    const result = data.filter(friend => friend.friendId === friendId);
    if (result.length > 0) {
      setStatus(result[0].status);
    }
  };

  return {
    error,
    loading,
    makeFriend,
    status,
    requestFriendStatus
  };
};
