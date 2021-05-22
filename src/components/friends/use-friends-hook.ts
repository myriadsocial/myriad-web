import { useState } from 'react';

import { User } from 'next-auth';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useFriends, FriendsActionType } from 'src/components/friends/friends.context';
import { ExtendedFriend, FriendStatus } from 'src/interfaces/friend';
import * as FriendAPI from 'src/lib/api/friends';

export const useFriendsHook = (user: WithAdditionalParams<User>) => {
  const { dispatch } = useFriends();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRequests = async () => {
    setLoading(true);

    try {
      const requests: ExtendedFriend[] = await FriendAPI.getFriendRequests(user.address as string);

      dispatch({
        type: FriendsActionType.LOAD_FRIEND_REQUESTS,
        payload: requests
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    const friends: ExtendedFriend[] = await FriendAPI.getFriends(user.address as string);

    dispatch({
      type: FriendsActionType.LOAD_FRIENDS,
      payload: friends
    });
  };

  const sendRequest = async (userId: string) => {
    await FriendAPI.sendRequest(user.address as string, userId);
  };

  const toggleRequest = async (friend: ExtendedFriend, status: FriendStatus) => {
    await FriendAPI.toggleRequest(friend.id, status);

    loadRequests();
    loadFriends();
  };

  return {
    error,
    loading,
    loadFriends,
    loadRequests,
    sendRequest,
    toggleRequest
  };
};
