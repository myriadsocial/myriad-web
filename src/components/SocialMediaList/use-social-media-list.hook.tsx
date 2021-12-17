import React, {useMemo} from 'react';

import RedditIcon from '../../images/socials/reddit.svg';
import TwitterIcon from '../../images/socials/twitter.svg';
import {SocialsEnum, SocialMedia} from '../../interfaces/social';

export type SocialDetail = {
  id: SocialsEnum;
  icon: React.ReactElement | React.FC;
  originId: string | null;
  connected: boolean;
  username: string | null;
};

function enumKeys<E>(e: E): (keyof E)[] {
  return Object.keys(e) as (keyof E)[];
}

export const useSocialMediaList = (connected: SocialMedia[]): SocialDetail[] => {
  const socials: SocialDetail[] = [];

  const icons: Partial<Record<SocialsEnum, JSX.Element>> = useMemo(
    () => ({
      [SocialsEnum.REDDIT]: <RedditIcon />,
      [SocialsEnum.TWITTER]: <TwitterIcon />,
    }),
    [],
  );

  const isSocialConnected = (social: SocialsEnum): boolean => {
    const match = connected.find(item => item.platform === social);

    return !!match && match.verified;
  };

  const getSocialOrigin = (social: SocialsEnum): string | null => {
    const match = connected.find(item => item.platform === social);

    return match && match.people ? match.people?.originUserId : null;
  };

  const getSocialUsername = (social: SocialsEnum): string | null => {
    const match = connected.find(item => item.platform === social);

    return match && match.people ? match.people?.username : null;
  };

  for (const key of enumKeys(SocialsEnum)) {
    const social: SocialsEnum = SocialsEnum[key];

    if (!icons[social]) continue;

    socials.push({
      id: social,
      icon: icons[social] as JSX.Element,
      originId: getSocialOrigin(social),
      connected: isSocialConnected(social),
      username: getSocialUsername(social),
    });
  }

  return socials;
};
