import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {FriendListComponent} from './FriendList';
import {FriendType} from './default';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';

type FriendListContainerProps = {
  user?: User;
  disableFilter?: boolean;
};

export const FriendListContainer: React.FC<FriendListContainerProps> = props => {
  const {user, disableFilter} = props;
  const {loadFriends, searchFriend, loadMoreFriends} = useFriendsHook(user);

  const [toggle, setToggle] = useState<string>('');
  const [friendList, setFriendList] = useState<Friend[]>([]);

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

  return (
    <>
      <FriendListComponent
        disableFilter={disableFilter}
        friends={friendList}
        user={user}
        hasMore={hasMore}
        onSearch={searchFriend}
        onFilter={handleFilterFriend}
        onSort={handleSortFriend}
        onLoadNextPage={loadMoreFriends}
      />
    </>
  );
};
