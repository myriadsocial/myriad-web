import React from 'react';
import {useSelector} from 'react-redux';

import {Socials as SocialsComponent} from '.';

import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const SocialsContainer: React.FC = () => {
  const {user, socials, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const handleDisconnectSocial = () => {
    // code
  };

  if (!user) return null;

  return (
    <SocialsComponent
      user={user}
      socials={socials}
      anonymous={anonymous}
      onDisconnectSocial={handleDisconnectSocial}
    />
  );
};
