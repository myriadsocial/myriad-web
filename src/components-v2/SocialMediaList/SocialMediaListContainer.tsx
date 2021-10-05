import React from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {SocialMediaList as SocialMediaListComponent} from '.';
import {SocialDetail} from './use-social-media-list.hook';

import {SocialsEnum} from 'src/interfaces/social';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const SocialMediaListContainer: React.FC = () => {
  const router = useRouter();

  const {socials} = useSelector<RootState, UserState>(state => state.userState);

  const handleOpenSocialPage = () => {
    router.push(`/socials`);
  };

  const getPlatformUrl = (social: SocialDetail): string => {
    let url = '';

    switch (social.id) {
      case SocialsEnum.TWITTER:
        url = `https://twitter.com/${social.originId}`;
        break;
      case SocialsEnum.REDDIT:
        url = `https://reddit.com/user/${social.originId}`;
        break;
      case SocialsEnum.FACEBOOK:
        url = `https://facebook.com/${social.originId}`;
        break;
      default:
        break;
    }

    return url;
  };
  const handleVerifySocial = (social: SocialDetail) => {
    const url = getPlatformUrl(social);

    window.open(url, '_blank');
  };

  return (
    <SocialMediaListComponent
      connected={socials}
      toggleVerify={handleVerifySocial}
      openSocialPage={handleOpenSocialPage}
    />
  );
};
