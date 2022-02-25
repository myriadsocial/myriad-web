import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useBlockList} from './use-blocked-list.hook';

import {Friend, FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {RootState} from 'src/reducers';
import {
  fetchFriendRequest,
  createFriendRequest,
  toggleFriendRequest,
  deleteFriendRequest,
} from 'src/reducers/friend-request/actions';
import {
  clearFriend,
  fetchFriend,
  searchFriend,
  updateFriendParams,
} from 'src/reducers/friend/actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFriendsHook = (user?: User) => {
  const dispatch = useDispatch();
  const {load: loadBlockedUsers} = useBlockList(user);

  const filter = useSelector<RootState, string | undefined>(state => state.friendState.filter);
  const {currentPage: currentFriendPage} = useSelector<RootState, ListMeta>(
    state => state.friendState.meta,
  );
  const {currentPage: currentFriendRequestPage} = useSelector<RootState, ListMeta>(
    state => state.friendRequestState.meta,
  );

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
    if (filter) {
      dispatch(searchFriend(filter, currentFriendPage + 1));
    } else {
      dispatch(fetchFriend(user, currentFriendPage + 1));
    }
  };

  const searchFriends = (query: string) => {
    if (!user) return;

    if (query.length === 0) {
      loadFriends();

      return;
    }

    dispatch(searchFriend(query));
  };

  const sort = (sort: 'ASC' | 'DESC') => {
    dispatch(updateFriendParams({sort}));

    if (filter) {
      searchFriends(filter);
    } else {
      loadFriends();
    }
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
        loadBlockedUsers();

        if (user) {
          checkFriendStatus([user]);
        }
      }),
    );
  };

  const removeFriendRequest = async (request: Friend) => {
    dispatch(deleteFriendRequest(request));
  };

  const clear = () => {
    dispatch(clearFriend());
  };

  return {
    error,
    loading,
    friended,
    loadFriends,
    loadMoreFriends,
    searchFriend: searchFriends,
    sort,
    loadRequests,
    loadMoreRequests,
    sendRequest,
    toggleRequest,
    removeFriendRequest,
    checkFriendStatus,
    clear,
  };
};
