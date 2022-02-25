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
import {fetchProfileFriend} from 'src/reducers/profile/actions';
import {checkFriendedStatus} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useFriendRequest = () => {
  const dispatch = useDispatch();
  const {loadNotifications} = useNotifHook();
  const {loadFriends: loadUsersFriends} = useFriendsHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const requestFriend = async (profile: User) => {
    await dispatch(createFriendRequest(profile));

    await dispatch(checkFriendedStatus());
  };

  const removeFriendRequest = async (request: Friend) => {
    await dispatch(deleteFriendRequest(request));

    await loadUsersFriends();
    await dispatch(fetchProfileFriend());
    await dispatch(checkFriendedStatus());

    loadNotifications();
  };

  const toggleRequest = async (request: Friend, status: FriendStatus) => {
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
    requestFriend,
    removeFriendRequest,
    toggleRequest,
    reloadFriendStatus,
  };
};
