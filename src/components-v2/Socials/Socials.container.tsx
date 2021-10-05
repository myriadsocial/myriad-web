import React from 'react';
import {useSelector} from 'react-redux';

import {Socials as SocialsComponent} from '.';

import {useShareSocial} from 'src/hooks/use-share-social';
import {SocialsEnum} from 'src/interfaces/social';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const SocialsContainer: React.FC = () => {
  const {user, socials, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {isVerifying, verifyPublicKeyShared} = useShareSocial();

  const handleDisconnectSocial = () => {
    // code
  };

  const handleVerifySocial = (social: SocialsEnum, username: string) => {
    verifyPublicKeyShared(social, username, () => {
      console.log('verified');
    });
  };

  if (!user) return null;

  return (
    <SocialsComponent
      user={user}
      socials={socials}
      anonymous={anonymous}
      verifying={isVerifying}
      onVerifySocialMedia={handleVerifySocial}
      onDisconnectSocial={handleDisconnectSocial}
    />
  );
};
