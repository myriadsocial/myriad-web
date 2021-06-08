// @ts-nocheck
import { useState, useEffect } from 'react';

import Axios from 'axios';
import { useProfile, ProfileActionType } from 'src/components/profile/profile.context';
import { FriendRequest } from 'src/interfaces/friend';
import { User } from 'src/interfaces/user';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useFriendHook = (user: User) => {
  const { state: profileState, dispatch } = useProfile();

  // const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeFriend = async (values: Partial<FriendRequest>) => {
    setLoading(true);

    try {
      const { data } = await MyriadAPI({
        url: `/users/${user.id}/friends`,
        method: 'POST',
        data: {
          ...values,
          requestorId: user.id
        }
      });

      checkFriendStatus(values.friendId);
      console.log('after Add friend', data);
    } catch (error) {
      setError(error);
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  // const requestFriendStatus = async friendId => {
  //   const { data } = await MyriadAPI({
  //     url: `/users/${user.id}/friends`,
  //     method: 'GET'
  //   });

  //   const result = data.filter(friend => friend.friendId === friendId);
  //   if (result.length > 0) {
  //     setStatus(result[0].status);
  //   }
  // };

  const checkFriendStatus = async friendId => {
    setLoading(true);

    try {
      const { data } = await MyriadAPI({
        url: `/friends`,
        method: 'GET',
        params: {
          filter: {
            where: {
              or: [
                { friendId: friendId, requestorId: user.id },
                { friendId: user.id, requestorId: friendId }
              ]
            }
          }
        }
      });

      console.log(data[0], 'status');
      dispatch({
        type: ProfileActionType.FRIEND_STATUS,
        payload: data[0]
      });
    } catch (error) {
      setError(error);
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    makeFriend,
    status,
    // requestFriendStatus,
    checkFriendStatus
  };
};
