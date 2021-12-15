import React from 'react';

import {SvgIcon} from '@material-ui/core';

import FacebookIcon from 'src/images/Icons/facebook.svg';
import RedditIcon from 'src/images/Icons/reddit.svg';
import TwitterIcon from 'src/images/Icons/twitter.svg';
import FourChanIcon from 'src/images/socials/4chan.svg';
import InstagramIcon from 'src/images/socials/instagram.svg';
import TelegramIcon from 'src/images/socials/telegram.svg';
import VKIcon from 'src/images/socials/vk.svg';
import WeChatIcon from 'src/images/socials/wechat.svg';
import WeiboIcon from 'src/images/socials/weibo.svg';
import {SocialsEnum} from 'src/interfaces/social';

export const socials: Record<SocialsEnum, JSX.Element> = {
  [SocialsEnum.FACEBOOK]: (
    <SvgIcon viewBox="0 0 20 20" style={{background: '#3b5998', fontSize: 20}}>
      <FacebookIcon style={{width: 20, height: 20}} />
    </SvgIcon>
  ),
  [SocialsEnum.REDDIT]: (
    <SvgIcon viewBox="0 0 20 20" style={{background: '#FF5700', fontSize: 20}}>
      <RedditIcon style={{width: 20, height: 20}} />
    </SvgIcon>
  ),
  [SocialsEnum.TWITTER]: (
    <SvgIcon viewBox="0 0 20 20" style={{background: '#1DA1F2', fontSize: 20}}>
      <TwitterIcon style={{width: 20, height: 20}} />
    </SvgIcon>
  ),
  [SocialsEnum.INSTAGRAM]: <InstagramIcon />,
  [SocialsEnum.WECHAT]: <WeChatIcon />,
  [SocialsEnum.TELEGRAM]: <TelegramIcon />,
  [SocialsEnum.FOURCHAN]: <FourChanIcon />,
  [SocialsEnum.VK]: <VKIcon />,
  [SocialsEnum.WEIBO]: <WeiboIcon />,
};
