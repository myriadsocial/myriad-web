import { useState } from 'react';

import { useAlertHook } from './use-alert.hook';

import { useFriends, FriendsActionType } from 'src/context/friends.context';
import { ExtendedFriend, FriendStatus } from 'src/interfaces/friend';
import { User } from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';

export const useFriendsHook = (user: User | null) => {
  const { dispatch } = useFriends();

  const [friended, setFriended] = useState<ExtendedFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert } = useAlertHook();

  const loadRequests = async () => {
    if (!user) return;

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
    if (!user) return;

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
    if (!user) return;

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

  const checkFriendStatus = async (userIds: string[]) => {
    if (!user) return;

    setLoading(true);

    try {
      const requests = await FriendAPI.checkFriendStatus(userIds);

      setFriended(requests);
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
    friended,
    loadFriends,
    searchFriend,
    loadRequests,
    sendRequest,
    toggleRequest,
    checkFriendStatus
  };
};
