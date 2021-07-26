import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Axios from 'axios';
import {FriendStatus, ExtendedFriend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {
  createFriendRequest,
  deleteFriendRequest,
  toggleFriendRequest,
} from 'src/reducers/friend/actions';
import {searchProfileFriend} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const useFriendHook = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const dispatch = useDispatch();

  const [friendStatus, setFriendStatus] = useState<ExtendedFriend | null>(null);
  const [loading, setLoading] = useState(false);

  const searchFriend = async (profile: User, query: string) => {
    if (!user) return;

    dispatch(searchProfileFriend(profile.id, query));
  };

  const makeFriend = async (profile: User) => {
    await dispatch(createFriendRequest(profile));

    checkFriendStatus(profile.id);
  };

  const cancelFriendRequest = async (request: ExtendedFriend) => {
    await dispatch(deleteFriendRequest(request));

    checkFriendStatus(request.requestorId);
  };

  const toggleRequest = async (request: ExtendedFriend, status: FriendStatus) => {
    setLoading(true);

    await dispatch(toggleFriendRequest(request, status));

    checkFriendStatus(request.requestorId);
  };

  const checkFriendStatus = async (friendId?: string) => {
    if (!user) return;

    setLoading(true);

    try {
      const {data} = await MyriadAPI.request<ExtendedFriend[]>({
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
