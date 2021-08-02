import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ExtendedFriend, FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {RootState} from 'src/reducers';
import {
  fetchFriend,
  fetchFriendRequest,
  createFriendRequest,
  searchFriend,
  toggleFriendRequest,
} from 'src/reducers/friend/actions';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFriendsHook = () => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {page} = useSelector<RootState, FriendState>(state => state.friendState);
  const [friended, setFriended] = useState<ExtendedFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRequests = () => {
    dispatch(fetchFriendRequest());
  };

  const loadFriends = () => {
    dispatch(fetchFriend());
  };

  const loadMoreFriends = () => {
    dispatch(fetchFriend(page + 1));
  };

  const searchFriends = (query: string) => {
    dispatch(searchFriend(query));
  };

  const sendRequest = async (destination: User) => {
    await dispatch(createFriendRequest(destination));
    if (user) checkFriendStatus([user]);
  };

  const checkFriendStatus = async (people: User[]) => {
    if (!user) return;

    setLoading(true);

    try {
      const requests = await FriendAPI.checkFriendStatus(people.map(user => user.id));

      setFriended(requests);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRequest = async (request: ExtendedFriend, status: FriendStatus) => {
    dispatch(toggleFriendRequest(request, status));
  };

  return {
    error,
    loading,
    friended,
    loadFriends,
    loadMoreFriends,
    searchFriend: searchFriends,
    loadRequests,
    sendRequest,
    toggleRequest,
    checkFriendStatus,
  };
};
