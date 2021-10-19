import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {BlockListComponent} from './BlockList';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {RootState} from 'src/reducers';
import {BlockState} from 'src/reducers/block/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BlockListContainer: React.FC = () => {
  const {users} = useSelector<RootState, BlockState>(state => state.blockState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const {loadBlockList, toggleRequest} = useFriendsHook(user);

  useEffect(() => {
    loadBlockList();
  }, []);

  const handleUnblockUser = (user: Friend) => {
    toggleRequest(user, FriendStatus.APPROVED);
  };

  return <BlockListComponent blockList={users} user={user} onUnblock={handleUnblockUser} />;
};
