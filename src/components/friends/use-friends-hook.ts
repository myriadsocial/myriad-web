import { useState } from 'react';

import { useAlertHook } from 'src/components/alert/use-alert.hook';
import { useFriends, FriendsActionType } from 'src/components/friends/friends.context';
import { ExtendedFriend, FriendStatus } from 'src/interfaces/friend';
import { User } from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';

export const useFriendsHook = (user: User) => {
  const { dispatch } = useFriends();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert } = useAlertHook();

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

  const searchFriend = async (query: string) => {
    const friends: ExtendedFriend[] = await FriendAPI.searchFriend(query);

    dispatch({
      type: FriendsActionType.LOAD_FRIENDS,
      payload: friends
    });
  };

  const sendRequest = async (destinationId: string) => {
    setLoading(true);
    try {
      await FriendAPI.sendRequest(user.id, destinationId);

      showAlert({
        title: 'Success!',
        message: 'Friend request sent',
        severity: 'success'
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
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
    searchFriend,
    loadRequests,
    sendRequest,
    toggleRequest
  };
};
