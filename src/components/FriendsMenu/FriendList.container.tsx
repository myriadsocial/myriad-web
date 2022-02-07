import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {FriendListComponent} from './FriendList';
import {FriendType} from './default';

import {Empty} from 'src/components/atoms/Empty';
import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {FriendState} from 'src/reducers/friend/reducer';
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
  const {loadFriends, searchFriend, loadMoreFriends} = useFriendsHook(user);

  const [toggle, setToggle] = useState<string>('');
  const [friendList, setFriendList] = useState<Friend[]>([]);

  const {detail, friendStatus} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const userLogin = useSelector<RootState, User | undefined>(state => state.userState.user);

  const isFriend = friendStatus?.status == 'approved';
  const isOwner = detail?.id == userLogin?.id;
  const isPrivate = settings.privacy.accountPrivacy == 'private';

  const {
    friends,
    meta: {totalItemCount: totalFriends},
  } = useSelector<RootState, FriendState>(state => state.friendState);
  const hasMore = friends.length < totalFriends;

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    setFriendList(friends);
  }, [friends, toggle]);

  const handleFilterFriend = (type: FriendType) => {
    // code
  };

  const handleSortFriend = (sort: string) => {
    let sortFriends;
    setToggle(sort);
    switch (sort) {
      case 'latest':
        sortFriends = friendList.sort((a, b) => {
          if (new Date(a.createdAt) < new Date(b.createdAt)) return 1;
          if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
          return 0;
        });
        setFriendList(sortFriends);
        break;
      case 'oldest':
        sortFriends = friendList.sort((a, b) => {
          if (new Date(a.createdAt) < new Date(b.createdAt)) return -1;
          if (new Date(a.createdAt) > new Date(b.createdAt)) return 1;
          return 0;
        });
        setFriendList(sortFriends);
        break;
      default:
        break;
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
      type={type}
      disableFilter={disableFilter}
      disableSort={disableSort}
      friends={friendList}
      user={user}
      hasMore={hasMore}
      onSearch={searchFriend}
      onFilter={handleFilterFriend}
      onSort={handleSortFriend}
      onLoadNextPage={loadMoreFriends}
    />
  );
};
