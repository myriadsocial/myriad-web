import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Socials as SocialsComponent} from '.';

import {useShareSocial} from 'src/hooks/use-share-social';
import {SocialMedia, SocialsEnum} from 'src/interfaces/social';
import {RootState} from 'src/reducers';
import {deleteSocial} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const SocialsContainer: React.FC = () => {
  const {isVerifying, resetVerification, verifyPublicKeyShared} = useShareSocial();
  const dispatch = useDispatch();

  const {user, socials, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const handleDisconnectSocial = (people: SocialMedia) => {
    dispatch(deleteSocial(people.id));
  };

  const handleVerifySocial = (social: SocialsEnum, profileUrl: string) => {
    verifyPublicKeyShared(social, profileUrl, () => {
      resetVerification();
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
