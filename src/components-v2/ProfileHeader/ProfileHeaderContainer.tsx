import React from 'react';
import {useSelector} from 'react-redux';

import {signOut} from 'next-auth/client';

import {ProfileHeader as ProfileHeaderComponent} from '.';
import {useAuthHook} from '../../hooks/auth.hook';

import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ProfileHeaderContainer: React.FC = () => {
  const {logout} = useAuthHook();
  const {user, anonymous, alias} = useSelector<RootState, UserState>(state => state.userState);

  const handleSignOut = async () => {
    if (anonymous === false) {
      logout();
    } else {
      await signOut({
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
        redirect: true,
      });
    }
  };

  return (
    <>
      {user && <ProfileHeaderComponent handleSignOut={handleSignOut} user={user} alias={alias} />}
    </>
  );
};
