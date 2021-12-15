import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {NoSsr} from '@material-ui/core';

import {SocialMediaList as SocialMediaListComponent} from '.';
import {AddSocialMedia} from '../AddSocialMedia';
import {SocialDetail} from './use-social-media-list.hook';

import {useShareSocial} from 'src/hooks/use-share-social';
import {SocialsEnum} from 'src/interfaces/social';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const SocialMediaListContainer: React.FC = () => {
  const router = useRouter();
  const {isVerifying, verifyPublicKeyShared} = useShareSocial();
  const {user, socials} = useSelector<RootState, UserState>(state => state.userState);

  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum | null>(null);

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
    verifyPublicKeyShared(social, profileUrl, () => {
      setSelectedSocial(null);
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
            publicKey={user.id}
            onClose={closeAddSocialMedia}
            verifying={isVerifying}
            verify={verifySocialMedia}
          />
        )}
      </NoSsr>
    </>
  );
};
