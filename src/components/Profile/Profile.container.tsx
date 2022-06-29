import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {Profile} from './Profile';

import {ProfileBanned} from 'components/ProfileBanned';
import {Friend} from 'src/interfaces/friend';
import {BlockedProps, User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

type ProfileContainerProps = {
  banned?: boolean;
};

export const ProfileContainer: React.FC<ProfileContainerProps> = props => {
  const {banned} = props;

  const {user, anonymous} = useSelector<RootState, {user: User; anonymous: boolean}>(
    state => ({
      user: state.userState.user,
      anonymous: state.userState.anonymous,
    }),
    shallowEqual,
  );
  const {person, friendStatus, loading} = useSelector<
    RootState,
    {person: User & BlockedProps; friendStatus: Friend; loading: boolean}
  >(
    state => ({
      person: state.profileState.detail,
      friendStatus: state.profileState.friendStatus,
      loading: state.profileState.loading,
    }),
    shallowEqual,
  );

  if (banned) return <ProfileBanned person={person} />;

  return (
    <Profile
      user={user}
      anonymous={anonymous}
      person={person}
      loading={loading}
      friendStatus={friendStatus}
    />
  );
};
