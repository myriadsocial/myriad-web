import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {FriendListComponent} from './FriendList';
import {FriendType} from './default';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
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

  const {
    friends,
    meta: {totalItemCount: totalFriends},
  } = useSelector<RootState, FriendState>(state => state.friendState);
  const hasMore = friends.length < totalFriends;

  useEffect(() => {
    loadFriends();
  }, []);

  const handleFilterFriend = (type: FriendType) => {
    // code
  };

  return (
    <FriendListComponent
      disableFilter={disableFilter}
      friends={friends}
      user={user}
      hasMore={hasMore}
      onSearch={searchFriend}
      onFilter={handleFilterFriend}
      onLoadNextPage={loadMoreFriends}
    />
  );
};
