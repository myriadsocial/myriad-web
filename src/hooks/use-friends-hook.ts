import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Friend, FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {RootState} from 'src/reducers';
import {
  fetchFriendRequest,
  createFriendRequest,
  toggleFriendRequest,
} from 'src/reducers/friend-request/actions';
import {FriendRequestState} from 'src/reducers/friend-request/reducer';
import {fetchFriend, searchFriend} from 'src/reducers/friend/actions';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFriendsHook = () => {
  const dispatch = useDispatch();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {
    meta: {currentPage: currentFriendPage},
  } = useSelector<RootState, FriendState>(state => state.friendState);
  const {
    meta: {currentPage: currentFriendRequestPage},
  } = useSelector<RootState, FriendRequestState>(state => state.friendRequestState);
  const [friended, setFriended] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRequests = () => {
    dispatch(fetchFriendRequest());
  };

  const loadMoreRequests = () => {
    dispatch(fetchFriendRequest(currentFriendRequestPage + 1));
  };

  const loadFriends = () => {
    dispatch(fetchFriend());
  };

  const loadMoreFriends = () => {
    dispatch(fetchFriend(currentFriendPage + 1));
  };

  const searchFriends = (query: string) => {
    dispatch(searchFriend(query));
  };

  const sendRequest = async (destination: User) => {
    await dispatch(createFriendRequest(destination));
  };

  const checkFriendStatus = async (people: User[]) => {
    if (!user) return;

    setLoading(true);

    try {
      const {data: requests} = await FriendAPI.checkFriendStatus(
        user.id,
        people.map(user => user.id),
      );

      setFriended(requests);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRequest = async (request: Friend, status: FriendStatus) => {
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
    loadMoreRequests,
    sendRequest,
    toggleRequest,
    checkFriendStatus,
  };
};
