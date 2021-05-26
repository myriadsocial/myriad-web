import { useState } from 'react';

import { useFriends, FriendsActionType } from 'src/components/friends/friends.context';
import { ExtendedFriend, FriendStatus } from 'src/interfaces/friend';
import { User } from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';

export const useFriendsHook = (user: User) => {
  const { dispatch } = useFriends();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRequests = async () => {
    setLoading(true);

    try {
      const requests: ExtendedFriend[] = await FriendAPI.getFriendRequests(user.id);

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
    const friends: ExtendedFriend[] = await FriendAPI.getFriends(user.id);

    dispatch({
      type: FriendsActionType.LOAD_FRIENDS,
      payload: friends
    });
  };

  const sendRequest = async (destinationId: string) => {
    await FriendAPI.sendRequest(user.id, destinationId);
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
