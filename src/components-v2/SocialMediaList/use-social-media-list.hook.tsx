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

export type SocialDetail = {
  id: SocialsEnum;
  icon: React.ReactElement | React.FC;
  originId: string | null;
  connected: boolean;
};

function enumKeys<E>(e: E): (keyof E)[] {
  return Object.keys(e) as (keyof E)[];
}

export const useSocialMediaList = (connected: SocialMedia[]): SocialDetail[] => {
  const socials: SocialDetail[] = [];

  const icons: Record<SocialsEnum, JSX.Element> = useMemo(
    () => ({
      [SocialsEnum.FACEBOOK]: <FacebookIcon />,
      [SocialsEnum.REDDIT]: <RedditIcon />,
      [SocialsEnum.TWITTER]: <TwitterIcon />,
      [SocialsEnum.INSTAGRAM]: <InstagramIcon />,
      [SocialsEnum.WECHAT]: <WeChatIcon />,
      [SocialsEnum.TELEGRAM]: <TelegramIcon />,
      [SocialsEnum.FOURCHAN]: <FourChanIcon />,
      [SocialsEnum.VK]: <VKIcon />,
      [SocialsEnum.WEIBO]: <WeiboIcon />,
    }),
    [],
  );

  const isSocialConnected = (social: SocialsEnum): boolean => {
    const match = connected.find(item => item.platform === social);

    return !!match && match.verified;
  };

  const getPrimarySocial = (social: SocialsEnum): string | null => {
    const match = connected.find(item => item.platform === social);

    return match ? match.userId : null;
  };

  for (const key of enumKeys(SocialsEnum)) {
    const social: SocialsEnum = SocialsEnum[key];

    socials.push({
      id: social,
      icon: icons[social],
      originId: getPrimarySocial(social),
      connected: isSocialConnected(social),
    });
  }

  return socials;
};
