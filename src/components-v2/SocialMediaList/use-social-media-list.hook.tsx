import React, {useMemo} from 'react';

import FourChanIcon from '../../images/socials/4chan.svg';
import FacebookIcon from '../../images/socials/facebook.svg';
import InstagramIcon from '../../images/socials/instagram.svg';
import RedditIcon from '../../images/socials/reddit.svg';
import TelegramIcon from '../../images/socials/telegram.svg';
import TwitterIcon from '../../images/socials/twitter.svg';
import VKIcon from '../../images/socials/vk.svg';
import WeChatIcon from '../../images/socials/wechat.svg';
import WeiboIcon from '../../images/socials/weibo.svg';
import {SocialsEnum, SocialMedia} from '../../interfaces/social';

<<<<<<< HEAD
export type SocialDetail = {
  id: SocialsEnum;
  icon: React.ReactElement | React.FC;
  originId: string | null;
  connected: boolean;
  username: string | null;
=======
type SocialDetail = {
  id: SocialsEnum;
  icon: React.ReactElement | React.FC;
  connected: boolean;
>>>>>>> da15b546 (MYR-703: box component)
};

function enumKeys<E>(e: E): (keyof E)[] {
  return Object.keys(e) as (keyof E)[];
}

export const useSocialMediaList = (connected: SocialMedia[]): SocialDetail[] => {
  const socials: SocialDetail[] = [];

  const icons: Record<SocialsEnum, JSX.Element> = useMemo(
    () => ({
<<<<<<< HEAD
      [SocialsEnum.FACEBOOK]: <FacebookIcon />,
      [SocialsEnum.REDDIT]: <RedditIcon />,
      [SocialsEnum.TWITTER]: <TwitterIcon />,
      [SocialsEnum.INSTAGRAM]: <InstagramIcon />,
      [SocialsEnum.WECHAT]: <WeChatIcon />,
      [SocialsEnum.TELEGRAM]: <TelegramIcon />,
=======
      facebook: <FacebookIcon />,
      reddit: <RedditIcon />,
      twitter: <TwitterIcon />,
      instagram: <InstagramIcon />,
      wechat: <WeChatIcon />,
      telegram: <TelegramIcon />,
>>>>>>> da15b546 (MYR-703: box component)
      [SocialsEnum.FOURCHAN]: <FourChanIcon />,
      [SocialsEnum.VK]: <VKIcon />,
      [SocialsEnum.WEIBO]: <WeiboIcon />,
    }),
    [],
  );

  const isSocialConnected = (social: SocialsEnum): boolean => {
<<<<<<< HEAD
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
=======
    return connected.filter(item => item.platform === social).length > 0;
>>>>>>> da15b546 (MYR-703: box component)
  };

  for (const key of enumKeys(SocialsEnum)) {
    const social: SocialsEnum = SocialsEnum[key];

    socials.push({
      id: social,
      icon: icons[social],
<<<<<<< HEAD
      originId: getSocialOrigin(social),
      connected: isSocialConnected(social),
      username: getSocialUsername(social),
=======
      connected: isSocialConnected(social),
>>>>>>> da15b546 (MYR-703: box component)
    });
  }

  return socials;
};
