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
  deleteFriendRequest,
} from 'src/reducers/friend-request/actions';
import {FriendRequestState} from 'src/reducers/friend-request/reducer';
import {fetchFriend, searchFriend} from 'src/reducers/friend/actions';
import {FriendState} from 'src/reducers/friend/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFriendsHook = (user?: User) => {
  const dispatch = useDispatch();

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
    if (!user) return;

    dispatch(fetchFriendRequest(user));
  };

  const loadMoreRequests = () => {
    dispatch(fetchFriendRequest(currentFriendRequestPage + 1));
  };

  const loadFriends = () => {
    if (!user) return;

    dispatch(fetchFriend(user));
  };

  const loadMoreFriends = () => {
    dispatch(fetchFriend(currentFriendPage + 1));
  };

  const searchFriends = (query: string) => {
    if (!user) return;

    dispatch(searchFriend(user, query));
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
    dispatch(
      toggleFriendRequest(request, status, () => {
        if (user) {
          checkFriendStatus([user]);
        }
      }),
    );
  };

  const removeFriendRequest = async (request: Friend) => {
    dispatch(deleteFriendRequest(request));
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
    removeFriendRequest,
    checkFriendStatus,
  };
};
