import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {FriendListComponent} from './FriendList';
import {FriendType} from './default';

import uniqBy from 'lodash/uniqBy';
import {Empty} from 'src/components/atoms/Empty';
import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useProfileFriend} from 'src/hooks/use-profile-friend.hook';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {ProfileState} from 'src/reducers/profile/reducer';

type FriendListContainerProps = {
  type?: 'contained' | 'basic';
  user?: User;
  disableFilter?: boolean;
  disableSort?: boolean;
  isProfile?: boolean;
};

export const FriendListContainer: React.FC<FriendListContainerProps> = props => {
  const {user, type, disableFilter = false, disableSort = false, isProfile = false} = props;
  const {
    hasMore: userHasMoreFriends,
    loadFriends: loadUserFriends,
    searchFriend: searchUserFriends,
    loadMoreFriends: loadMoreUserFriends,
    clear,
  } = useFriendsHook(user);
  const {
    hasMore: profileHasMoreFriends,
    loadMore: loadMoreProfileFriends,
    search: searchProfileFriends,
    sort: sortProfileFriend,
  } = useProfileFriend();

  const {detail, friendStatus} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const userLogin = useSelector<RootState, User | undefined>(state => state.userState.user);
  const userFriends = useSelector<RootState, Friend[]>(state => state.friendState.friends);
  const profileFriends = useSelector<RootState, Friend[]>(state => state.profileState.friends.data);

  const [isFiltered, setFiltered] = useState(false);

  const isFriend = friendStatus?.status == 'approved';
  const isOwner = detail?.id == userLogin?.id;
  const isPrivate = settings.privacy.accountPrivacy == 'private';

  // TODO: replace uniqBy, make sure infinite scroll work properly
  const friends = isProfile ? profileFriends : uniqBy(userFriends, 'id');
  const hasMore = isProfile ? profileHasMoreFriends : userHasMoreFriends;

  useEffect(() => {
    return () => {
      clear();
      loadUserFriends();
    };
  }, []);

  const handleLoadMore = () => {
    if (isProfile) {
      loadMoreProfileFriends();
    } else {
      loadMoreUserFriends();
    }
  };

  const handleSearchFriend = (query: string) => {
    const sanitizedQuery = query.trim();

    setFiltered(sanitizedQuery.length > 0);

    if (isProfile) {
      searchProfileFriends(sanitizedQuery);
    } else {
      searchUserFriends(sanitizedQuery);
    }
  };

  const handleFilterFriend = (type: FriendType) => {
    // code
  };

  const handleSortFriend = (sort: SortType) => {
    if (isProfile) {
      sortProfileFriend(sort);
    } else {
      //
    }
  };

  if (isPrivate && !isFriend && !isOwner && isProfile) {
    return (
      <div style={{marginTop: 30}}>
        <Empty
          title={i18n.t('Profile.Friend.Empty.Title')}
          subtitle={i18n.t('Profile.Friend.Empty.Subtitle')}
        />
      </div>
    );
  }

  return (
    <FriendListComponent
      isFiltered={isFiltered}
      type={type}
      disableFilter={disableFilter}
      disableSort={disableSort}
      friends={friends}
      user={user}
      hasMore={hasMore}
      onSearch={handleSearchFriend}
      onFilter={handleFilterFriend}
      onSort={handleSortFriend}
      onLoadNextPage={handleLoadMore}
    />
  );
};

export default FriendListContainer;
