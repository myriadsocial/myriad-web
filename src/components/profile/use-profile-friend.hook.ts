import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import getConfig from 'next/config';

import Axios from 'axios';
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
import {searchProfileFriend} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

const {publicRuntimeConfig} = getConfig();

const MyriadAPI = Axios.create({
  baseURL: publicRuntimeConfig.apiURL,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  const cancelFriendRequest = async (request: Friend) => {
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
    await checkFriendStatus(request.requestorId);
  };

  const checkFriendStatus = async (friendId?: string) => {
    if (!user) return;

    setLoading(true);

    try {
      const {data} = await MyriadAPI.request<Friend[]>({
        url: `/friends`,
        method: 'GET',
        params: {
          filter: {
            where: {
              or: [
                {friendId: friendId, requestorId: user.id},
                {friendId: user.id, requestorId: friendId},
              ],
            },
          },
        },
      });

      setFriendStatus(data[0]);
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
