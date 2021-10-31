import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {BlockListComponent} from './BlockList';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {Friend} from 'src/interfaces/friend';
import {RootState} from 'src/reducers';
import {unblockUser} from 'src/reducers/block/actions';
import {BlockState} from 'src/reducers/block/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BlockListContainer: React.FC = () => {
  const dispatch = useDispatch();

  const {users} = useSelector<RootState, BlockState>(state => state.blockState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const {loadBlockList} = useFriendsHook(user);

  useEffect(() => {
    loadBlockList();
  }, []);

  const handleUnblockUser = (friend: Friend) => {
    dispatch(unblockUser(friend.id));
  };

  return <BlockListComponent blockList={users} user={user} onUnblock={handleUnblockUser} />;
};
