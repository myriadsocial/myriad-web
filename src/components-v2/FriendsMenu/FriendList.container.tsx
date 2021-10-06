import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {FriendType} from './default';
import {FriendListComponent} from './friend-list';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';

type FriendListContainerProps = {
  user?: User;
};

export const FriendListContainer: React.FC<FriendListContainerProps> = props => {
  const {user} = props;
  const {loadFriends, searchFriend} = useFriendsHook();

  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);

  useEffect(() => {
    loadFriends();
  }, []);

  const handleFilterFriend = (type: FriendType) => {
    // code
  };

  return (
    <FriendListComponent
      friends={friends}
      user={user}
      onSearch={searchFriend}
      onFilter={handleFilterFriend}
    />
  );
};
