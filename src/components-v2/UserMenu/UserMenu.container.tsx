import React from 'react';
import {useSelector} from 'react-redux';

import {UserMenu} from './UserMenu';

import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type UserMenuContainerProps = {
  anonymous?: boolean;
};

export const UserMenuContainer: React.FC<UserMenuContainerProps> = props => {
  const {anonymous = false} = props;

  const {user} = useSelector<RootState, UserState>(state => state.userState);

  return (
    <UserMenu
      selected="post"
      anonymous={anonymous}
      user={user}
      experiences={[]}
      socials={[]}
      friends={[]}
    />
  );
};
