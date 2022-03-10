import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useNotifHook} from 'src/hooks/use-notif.hook';
import {FriendStatus, Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import {RootState} from 'src/reducers';
import {
  createFriendRequest,
  deleteFriendRequest,
  toggleFriendRequest,
} from 'src/reducers/friend-request/actions';
import {
  searchProfileFriend,
  fetchProfileFriend,
  updateProfileFriendParams,
} from 'src/reducers/profile/actions';
import {checkFriendedStatus} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

export const useProfileFriend = () => {
  const dispatch = useDispatch();
  const {loadNotifications} = useNotifHook();
  const {loadFriends: loadUsersFriends} = useFriendsHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const filter = useSelector<RootState, string | undefined>(
    state => state.profileState.friends.filter,
  );
  const currentFriendPage = useSelector<RootState, number>(
    state => state.profileState.friends.meta.currentPage,
  );
  const totalPageCount = useSelector<RootState, number>(
    state => state.profileState.friends.meta.totalPageCount,
  );

  const [loading, setLoading] = useState(false);

  const load = (page = 1) => {
    dispatch(fetchProfileFriend(page));
  };

  const search = (query: string, page = 1) => {
    if (query.length === 0) {
      load();

      return;
    }

    dispatch(searchProfileFriend(query, page));
  };

  const sort = (sort: SortType) => {
    dispatch(updateProfileFriendParams({sort}));

    if (filter) {
      search(filter);
    } else {
      load();
    }
  };

  const loadMore = () => {
    if (filter) {
      search(filter, currentFriendPage + 1);
    } else {
      load(currentFriendPage + 1);
    }
  };

  const makeFriend = async (profile: User) => {
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
    setLoading(true);

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
    loading,
    hasMore: currentFriendPage < totalPageCount,
    load,
    loadMore,
    search,
    sort,
    makeFriend,
    removeFriendRequest,
    toggleRequest,
    reloadFriendStatus,
  };
};
