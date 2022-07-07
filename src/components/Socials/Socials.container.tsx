import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useSession} from 'next-auth/react';

import {Socials as SocialsComponent} from '.';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {useShareSocial} from 'src/hooks/use-share-social';
import {SocialMedia, SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {deleteSocial, setAsPrimary} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const SocialsContainer: React.FC = () => {
  const {data: session} = useSession();
  const dispatch = useDispatch();

  const {isVerifying, resetVerification, verifyPublicKeyShared} = useShareSocial();

  const enqueueSnackbar = useEnqueueSnackbar();

  const {user, socials, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const address = session?.user.address as string;

  const handleDisconnectSocial = (people: SocialMedia) => {
    dispatch(deleteSocial(people.id));
  };

  const handleVerifySocial = async (social: SocialsEnum, profileUrl: string) => {
    verifyPublicKeyShared(social, profileUrl, address, () => {
      resetVerification();

      enqueueSnackbar({
        message: i18n.t('SocialMedia.Alert.Verify', {social: social}),
        variant: 'success',
      });
    });
  };

  const handleSetUserSocialAsPrimary = (people: SocialMedia) => {
    dispatch(setAsPrimary(people.id));
  };

  return (
    <>
      <SocialsComponent
        user={user}
        socials={socials}
        address={address}
        anonymous={anonymous}
        verifying={isVerifying}
        onVerifySocialMedia={handleVerifySocial}
        onDisconnectSocial={handleDisconnectSocial}
        onSetAsPrimary={handleSetUserSocialAsPrimary}
      />
    </>
  );
};

export default SocialsContainer;
