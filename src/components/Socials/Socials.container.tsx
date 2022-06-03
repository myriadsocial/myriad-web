import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useSession} from 'next-auth/client';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {Socials as SocialsComponent} from '.';

import {useShareSocial} from 'src/hooks/use-share-social';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {SocialMedia, SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {deleteSocial, setAsPrimary} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export const SocialsContainer: React.FC = () => {
  const [session] = useSession();
  const dispatch = useDispatch();

  const {
    isVerifying,
    resetVerification,
    verifyPublicKeyShared,
    isSignerLoading,
    verifySocialMedia,
  } = useShareSocial();

  const {openToasterSnack} = useToasterSnackHook();

  const {user, socials, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const [useBlockchain] = useState<boolean>(true);

  const address = session?.user.address as string;

  const handleDisconnectSocial = (people: SocialMedia) => {
    dispatch(deleteSocial(people.id));
  };

  const handleVerifySocial = async (
    social: SocialsEnum,
    profileUrl: string,
    account?: InjectedAccountWithMeta,
    callback?: () => void,
  ) => {
    if (useBlockchain && account) {
      verifySocialMedia(social, profileUrl, account, ({isVerified}) => {
        callback && callback();

        isVerified &&
          openToasterSnack({
            message: i18n.t('SocialMedia.Alert.Verify', {social: social}),
            variant: 'success',
          });

        !isVerified &&
          openToasterSnack({
            message: i18n.t('SocialMedia.Alert.Error'),
            variant: 'error',
          });
      });
    } else {
      verifyPublicKeyShared(social, profileUrl, address, true, () => {
        resetVerification();

        openToasterSnack({
          message: i18n.t('SocialMedia.Alert.Verify', {social: social}),
          variant: 'success',
        });
      });
    }
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
        verifying={useBlockchain ? isSignerLoading : isVerifying}
        onVerifySocialMedia={handleVerifySocial}
        onDisconnectSocial={handleDisconnectSocial}
        onSetAsPrimary={handleSetUserSocialAsPrimary}
        useBlockchain={useBlockchain}
      />
    </>
  );
};
