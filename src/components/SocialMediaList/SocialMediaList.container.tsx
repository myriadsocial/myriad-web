import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {useSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import {NoSsr} from '@material-ui/core';

import {AddSocialMedia} from '../AddSocialMedia';
import {SocialMediaList as SocialMediaListComponent} from './SocialMediaList';
import {SocialDetail} from './use-social-media-list.hook';

import {useShareSocial} from 'src/hooks/use-share-social';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {SocialsEnum} from 'src/interfaces/social';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const SocialMediaListContainer: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();

  const {isVerifying, verifyPublicKeyShared} = useShareSocial();
  const {user, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {openToasterSnack} = useToasterSnackHook();

  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum | null>(null);
  const address = session?.user.address as string;

  const handleOpenSocialPage = () => {
    router.push(`/socials`);
  };

  const handleAddSocialMedia = (social: SocialsEnum) => {
    setSelectedSocial(social);
  };

  const closeAddSocialMedia = () => {
    setSelectedSocial(null);
  };

  const verifySocialMedia = (social: SocialsEnum, profileUrl: string) => {
    verifyPublicKeyShared(social, profileUrl, address, () => {
      setSelectedSocial(null);

      openToasterSnack({
        message: ` Your ${social} account successfully connected!`,
        variant: 'success',
      });
    });
  };

  const getPlatformUrl = (social: SocialDetail): string => {
    let url = '';

    switch (social.id) {
      case SocialsEnum.TWITTER:
        url = `https://twitter.com/${social.username}`;
        break;
      case SocialsEnum.REDDIT:
        url = `https://reddit.com/user/${social.username}`;
        break;
      case SocialsEnum.FACEBOOK:
        url = `https://facebook.com/${social.username}`;
        break;
      default:
        break;
    }

    return url;
  };

  const handleOpenSocialLink = (social: SocialDetail) => {
    const url = getPlatformUrl(social);

    if (url.length) {
      window.open(url, '_blank');
    }
  };

  if (!user) return null;

  return (
    <>
      <SocialMediaListComponent
        connected={socials}
        addSocial={handleAddSocialMedia}
        openSocialLink={handleOpenSocialLink}
        openSocialPage={handleOpenSocialPage}
      />

      <NoSsr>
        {selectedSocial && (
          <AddSocialMedia
            open={Boolean(selectedSocial)}
            social={selectedSocial}
            address={address}
            onClose={closeAddSocialMedia}
            verifying={isVerifying}
            verify={verifySocialMedia}
          />
        )}
      </NoSsr>
    </>
  );
};
