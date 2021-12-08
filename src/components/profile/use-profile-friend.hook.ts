import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useNotifHook} from 'src/hooks/use-notif.hook';
import {FriendStatus, Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {
  createFriendRequest,
  deleteFriendRequest,
  toggleFriendRequest,
} from 'src/reducers/friend-request/actions';
import {searchProfileFriend, fetchProfileFriend} from 'src/reducers/profile/actions';
import {checkFriendedStatus} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useFriendHook = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const {loadNotifications} = useNotifHook();
  const {loadFriends} = useFriendsHook();

  const searchFriend = async (profile: User, query: string) => {
    dispatch(searchProfileFriend(profile.id, query));
  };

  const makeFriend = async (profile: User) => {
    await dispatch(createFriendRequest(profile));

    await dispatch(checkFriendedStatus());
  };

  const removeFriendRequest = async (request: Friend) => {
    await dispatch(deleteFriendRequest(request));

    await loadFriends();
    await dispatch(fetchProfileFriend());
    await dispatch(checkFriendedStatus());

    loadNotifications();
  };

  const toggleRequest = async (request: Friend, status: FriendStatus) => {
    setLoading(true);

    await dispatch(toggleFriendRequest(request, status));
    await dispatch(fetchProfileFriend());

    if (!user) return;

    await dispatch(checkFriendedStatus());
  };

  const reloadFriendStatus = async () => {
    await dispatch(fetchProfileFriend());
    await dispatch(checkFriendedStatus());
  };

  return {
    loading,
    makeFriend,
    searchFriend,
    removeFriendRequest,
    toggleRequest,
    reloadFriendStatus,
  };
};
