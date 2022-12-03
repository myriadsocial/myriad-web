import {useDispatch} from 'react-redux';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useNotifHook} from 'src/hooks/use-notif.hook';
import {FriendStatus} from 'src/interfaces/friend';
import {FriendStatusProps, User} from 'src/interfaces/user';
import {
  createFriendRequest,
  deleteFriendRequest,
  toggleFriendRequest,
} from 'src/reducers/friend-request/actions';
import {fetchProfileFriend, setProfile} from 'src/reducers/profile/actions';

export const useFriendRequest = () => {
  const dispatch = useDispatch();
  const {loadNotifications} = useNotifHook();
  const {loadFriends: loadUsersFriends} = useFriendsHook();

  const requestFriend = async (profile: User) => {
    await dispatch(createFriendRequest(profile));
  };

  const removeFriendRequest = async (
    profile: User & {friendInfo: FriendStatusProps},
    callback?: () => void,
  ) => {
    if (!profile?.friendInfo?.id) return;

    await dispatch(deleteFriendRequest(profile?.friendInfo?.id));
    await loadUsersFriends();
    await dispatch(fetchProfileFriend());
    await dispatch(
      setProfile({
        ...profile,
        friendInfo: null,
      }),
    );

    loadNotifications();
    callback && callback();
  };

  const toggleRequest = async (friendId: string, status: FriendStatus) => {
    await dispatch(toggleFriendRequest(friendId, status));
    await dispatch(fetchProfileFriend());
  };

  return {
    requestFriend,
    removeFriendRequest,
    toggleRequest,
  };
};
