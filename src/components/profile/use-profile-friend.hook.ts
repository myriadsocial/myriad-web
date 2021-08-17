import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

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
import {searchProfileFriend} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useFriendHook = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();

  const [friendStatus, setFriendStatus] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(false);
  const {loadNotifications} = useNotifHook();

  const searchFriend = async (profile: User, query: string) => {
    if (!user) return;

    dispatch(searchProfileFriend(profile.id, query));
  };

  const makeFriend = async (profile: User) => {
    await dispatch(createFriendRequest(profile));

    checkFriendStatus(profile.id);
  };

  const cancelFriendRequest = async (request: Friend) => {
    await dispatch(deleteFriendRequest(request));

    checkFriendStatus(request.requestorId);
    loadNotifications();
  };

  const toggleRequest = async (request: Friend, status: FriendStatus) => {
    setLoading(true);

    await dispatch(toggleFriendRequest(request, status));

    checkFriendStatus(request.requestorId);
  };

  const checkFriendStatus = async (friendId: string) => {
    if (!user) return;

    setLoading(true);

    try {
      const {data} = await FriendAPI.checkFriendStatus(user.id, [friendId]);

      if (data.length > 0) {
        setFriendStatus(data[0]);
      }
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
    cancelFriendRequest,
    checkFriendStatus,
    toggleRequest,
  };
};
