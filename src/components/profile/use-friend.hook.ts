// @ts-nocheck
import { useState, useEffect } from 'react';

import Axios from 'axios';
import { useProfile, ProfileActionType } from 'src/components/profile/profile.context';
import { useFriendsHook } from 'src/hooks/use-friends-hook';
import { FriendStatus, ExtendedFriend } from 'src/interfaces/friend';
import { User } from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const useFriendHook = (user: User | null) => {
  const { loadFriends, loadRequests } = useFriendsHook(user);
  const { state: profileState, dispatch } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFriends = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const friends: ExtendedFriend[] = await FriendAPI.getFriends(user.id);

      dispatch({
        type: ProfileActionType.LOAD_FRIENDS,
        payload: friends
      });
    } catch (error) {
      setError(error);
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  const searchFriend = async (query: string) => {
    if (!user) return null;
    setLoading(true);

    try {
      const friends: ExtendedFriend[] = await FriendAPI.searchFriend(user.id, query);
      dispatch({
        type: ProfileActionType.LOAD_FRIENDS,
        payload: friends
      });
    } catch (error) {
      setError(error);
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  const makeFriend = async (values: Partial<ExtendedFriend>) => {
    if (!user) return;

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
    } catch (error) {
      setError(error);
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  const checkFriendStatus = async friendId => {
    if (!user) return;

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

  const cancelFriendRequest = async (friend: ExtendedFriend) => {
    setLoading(true);

    try {
      const { data } = await MyriadAPI({
        url: `/friends/${friend.id}`,
        method: 'DELETE'
      });

      if (user?.id !== friend.friendId) checkFriendStatus(friend.friendId);
      else checkFriendStatus(friend.requestorId);
      getFriends();
      loadFriends();
      loadRequests();
    } catch (error) {
      setError(error);
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  const toggleRequest = async (friend: ExtendedFriend, status: FriendStatus) => {
    setLoading(true);

    try {
      await FriendAPI.toggleRequest(friend.id, status);

      getFriends();
      loadFriends();
      loadRequests();
      if (user?.id !== friend.friendId) checkFriendStatus(friend.friendId);
      else checkFriendStatus(friend.requestorId);
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
    getFriends,
    makeFriend,
    searchFriend,
    status,
    cancelFriendRequest,
    checkFriendStatus,
    toggleRequest
  };
};
