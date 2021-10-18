import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useNotifHook} from 'src/hooks/use-notif.hook';
import {FriendStatus, Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {RootState} from 'src/reducers';
import {
  createFriendRequest,
  deleteFriendRequest,
  toggleFriendRequest,
} from 'src/reducers/friend-request/actions';
import {searchProfileFriend, fetchProfileFriend} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useFriendHook = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();

  const [friendStatus, setFriendStatus] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(false);
  const {loadNotifications} = useNotifHook();
  const {loadFriends} = useFriendsHook();

  const searchFriend = async (profile: User, query: string) => {
    dispatch(searchProfileFriend(profile.id, query));
  };

  const makeFriend = async (profile: User) => {
    await dispatch(createFriendRequest(profile));

    checkFriendStatus(profile.id);
  };

  const removeFriendRequest = async (request: Friend) => {
    await dispatch(deleteFriendRequest(request));

    await loadFriends();
    await dispatch(fetchProfileFriend());
    await checkFriendStatus(request.requestorId);
    loadNotifications();
  };

  const toggleRequest = async (request: Friend, status: FriendStatus) => {
    setLoading(true);

    await dispatch(toggleFriendRequest(request, status));
    await dispatch(fetchProfileFriend());

    if (!user) return;
    if (user.id === request.requesteeId) {
      await checkFriendStatus(request.requestorId);
    } else {
      await checkFriendStatus(request.requesteeId);
    }
  };

  const checkFriendStatus = async (friendId: string) => {
    if (!user) return;

    setLoading(true);

    try {
      const {data} = await FriendAPI.checkFriendStatus(user.id, [friendId]);
      if (data.length > 0) setFriendStatus(data[0]);
      else setFriendStatus(null);
    } catch (error) {
      console.log(error, '<<<error');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    friendStatus,
    makeFriend,
    searchFriend,
    removeFriendRequest,
    checkFriendStatus,
    toggleRequest,
  };
};
