import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {UserMenu} from './UserMenu';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type UserMenuContainerProps = {
  anonymous?: boolean;
  isMyriad?: boolean;
};

export const UserMenuContainer: React.FC<UserMenuContainerProps> = props => {
  const {anonymous = false, isMyriad = false} = props;

  const {loadFriends} = useFriendsHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);

  useEffect(() => {
    loadFriends();
  }, []);

  return <UserMenu selected="post" anonymous={anonymous} user={user} isMyriad={isMyriad} />;
};
