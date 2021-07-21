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
import {UserState} from 'src/reducers/user/reducer';

export const useFriendsHook = () => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const [friended, setFriended] = useState<ExtendedFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRequests = async () => {
    dispatch(fetchFriendRequest());
  };

  const loadFriends = async () => {
    dispatch(fetchFriend());
  };

  const searchFriends = async (query: string) => {
    dispatch(searchFriend(query));
  };

  const sendRequest = async (destination: User) => {
    dispatch(createFriendRequest(destination));
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
    searchFriend: searchFriends,
    loadRequests,
    sendRequest,
    toggleRequest,
    checkFriendStatus,
  };
};
