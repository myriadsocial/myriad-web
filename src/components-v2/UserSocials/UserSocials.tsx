import React, {useMemo} from 'react';

import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  capitalize,
  Avatar,
  ListItemAvatar,
} from '@material-ui/core';

import FourChanIcon from '../../images/socials/4chan.svg';
import FacebookIcon from '../../images/socials/facebook.svg';
import InstagramIcon from '../../images/socials/instagram.svg';
import RedditIcon from '../../images/socials/reddit.svg';
import TelegramIcon from '../../images/socials/telegram.svg';
import TwitterIcon from '../../images/socials/twitter.svg';
import VKIcon from '../../images/socials/vk.svg';
import WeChatIcon from '../../images/socials/wechat.svg';
import WeiboIcon from '../../images/socials/weibo.svg';
import {SocialMedia, SocialsEnum} from '../../interfaces/social';
import {useStyles} from './UserSocials.styles';

import {groupBy} from 'lodash';
import {Empty} from 'src/components-v2/atoms/Empty';

type UserSocialsProps = {
  socials: SocialMedia[];
};

export const UserSocials: React.FC<UserSocialsProps> = props => {
  const {socials} = props;

  const styles = useStyles();

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

  const grouped = groupBy<SocialMedia>(socials, 'platform');

  if (socials.length === 0) {
    return (
      <Empty
        title="No social media connected yet"
        subtitle="connect your socials and you may get some reward"
      />
    );
  }

  return (
    <div className={styles.root}>
      <List component="div">
        {Object.keys(grouped).map(social => {
          return (
            <>
              <ListItem key={social} className={styles.item}>
                <ListItemIcon className={styles[social as SocialsEnum]}>
                  {icons[social as SocialsEnum]}
                </ListItemIcon>
                <ListItemText primary={capitalize(social)} />
              </ListItem>

              <Collapse in={true} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {grouped[social].map(socialMedia => (
                    <ListItem className={styles.nested} key={socialMedia.id}>
                      <ListItemAvatar>
                        <Avatar
                          alt={socialMedia.people?.name}
                          src={socialMedia.people?.profilePictureURL}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={socialMedia.people?.name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          );
        })}
      </List>
    </div>
  );
};
