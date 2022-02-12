import React from 'react';

import {SvgIcon} from '@material-ui/core';

import FacebookDefault from 'src/images/Icons/facebook.svg';
import RedditDefault from 'src/images/Icons/reddit.svg';
import TwitterDefault from 'src/images/Icons/twitter.svg';
import FourChan from 'src/images/socials/4chan.svg';
import Facebook from 'src/images/socials/facebook.svg';
import Instagram from 'src/images/socials/instagram.svg';
import Reddit from 'src/images/socials/reddit.svg';
import Telegram from 'src/images/socials/telegram.svg';
import Twitter from 'src/images/socials/twitter.svg';
import VK from 'src/images/socials/vk.svg';
import WeChat from 'src/images/socials/wechat.svg';
import Weibo from 'src/images/socials/weibo.svg';
import {SocialsEnum} from 'src/interfaces/social';

export const TwitterIcon = (
  <SvgIcon viewBox="0 0 20 20" style={{background: '#3b5998', fontSize: 20}}>
    <TwitterDefault style={{width: 20, height: 20}} />
  </SvgIcon>
);

export const RedditIcon = (
  <SvgIcon viewBox="0 0 20 20" style={{background: '#3b5998', fontSize: 20}}>
    <RedditDefault style={{width: 20, height: 20}} />
  </SvgIcon>
);

export const FacebookIcon = (
  <SvgIcon viewBox="0 0 20 20" style={{background: '#3b5998', fontSize: 20}}>
    <FacebookDefault style={{width: 20, height: 20}} />
  </SvgIcon>
);

export const socials: Record<SocialsEnum, JSX.Element> = {
  [SocialsEnum.FACEBOOK]: <Facebook />,
  [SocialsEnum.REDDIT]: <Reddit />,
  [SocialsEnum.TWITTER]: <Twitter />,
  [SocialsEnum.INSTAGRAM]: <Instagram />,
  [SocialsEnum.WECHAT]: <WeChat />,
  [SocialsEnum.TELEGRAM]: <Telegram />,
  [SocialsEnum.FOURCHAN]: <FourChan />,
  [SocialsEnum.VK]: <VK />,
  [SocialsEnum.WEIBO]: <Weibo />,
};
