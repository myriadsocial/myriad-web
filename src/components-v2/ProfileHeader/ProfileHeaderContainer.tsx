import React from 'react';
import {useSelector} from 'react-redux';

import {ProfileHeader as ProfileHeaderComponent} from '.';

import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ProfileHeaderContainer: React.FC = () => {
  const {user, alias} = useSelector<RootState, UserState>(state => state.userState);

  return (
    <ProfileHeaderComponent
      name={user?.name || alias}
      username={user?.username || alias}
      avatar={user?.profilePictureURL}
    />
  );
};
