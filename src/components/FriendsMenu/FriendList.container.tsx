import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {FriendListComponent} from './FriendList';
import {FriendType} from './default';

import {Empty} from 'src/components/atoms/Empty';
import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useProfileFriend} from 'src/hooks/use-profile-friend.hook';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
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
    loadFriends: loadUserFriends,
    searchFriend: searchUserFriends,
    loadMoreFriends: loadMoreUserFriends,
    clear,
  } = useFriendsHook(user);
  const {
    loadMore: loadMoreProfileFriends,
    search: searchProfileFriends,
    sort: sortProfileFriend,
  } = useProfileFriend();

  const {detail, friendStatus} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const userLogin = useSelector<RootState, User | undefined>(state => state.userState.user);
  const userFriends = useSelector<RootState, Friend[]>(state => state.friendState.friends);
  const totalUserFriends = useSelector<RootState, number>(
    state => state.friendState.meta.totalItemCount,
  );
  const profileFriends = useSelector<RootState, Friend[]>(state => state.profileState.friends.data);
  const totalProfileFriends = useSelector<RootState, number>(
    state => state.profileState.friends.meta.totalItemCount,
  );

  const [isFiltered, setFiltered] = useState(false);
  const isFriend = friendStatus?.status == 'approved';
  const isOwner = detail?.id == userLogin?.id;
  const isPrivate = settings.privacy.accountPrivacy == 'private';

  const friends = isProfile ? profileFriends : userFriends;
  const hasMore = isProfile
    ? profileFriends.length < totalProfileFriends
    : userFriends.length < totalUserFriends;

  useEffect(() => {
    if (!isProfile) {
      loadUserFriends();
    }

    return () => {
      clear();
    };
  }, [isProfile]);

  const handleLoadMore = () => {
    if (isProfile) {
      loadMoreProfileFriends();
    } else {
      loadMoreUserFriends();
    }
  };

  const handleSearchFriend = (query: string) => {
    setFiltered(query.length > 0);

    if (isProfile) {
      searchProfileFriends(query);
    } else {
      searchUserFriends(query);
    }
  };

  const handleFilterFriend = (type: FriendType) => {
    console.log('handleFilterFriend', type);
  };

  const handleSortFriend = (sortType: string) => {
    const sort = sortType === 'latest' ? 'DESC' : 'ASC';

    if (isProfile) {
      sortProfileFriend(sort);
    } else {
      //
    }
  };

  if (isPrivate && !isFriend && !isOwner && isProfile) {
    return (
      <div style={{marginTop: '27px'}}>
        <Empty
          title="Nothing to see here!"
          subtitle="This account is private. Send them a friend request to see their full profile."
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
