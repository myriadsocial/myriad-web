import React from 'react';

import {List, ListItem, ListItemText, Avatar, ListItemAvatar, Badge} from '@material-ui/core';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

import {SocialMedia, SocialsEnum} from '../../interfaces/social';
import {useStyles} from './UserSocials.styles';

import {Empty} from 'src/components/atoms/Empty';
import {socials as socialsIcon} from 'src/components/atoms/Icons';

type UserSocialsProps = {
  socials: SocialMedia[];
  isPrivate: boolean;
  isFriend: boolean;
  isOwner: boolean;
};

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 5,
      top: 44,
      width: 20,
      height: 20,
      padding: 0,
      overflow: 'hidden',
    },
  }),
)(Badge);

export const UserSocials: React.FC<UserSocialsProps> = props => {
  const {socials, isPrivate, isFriend, isOwner} = props;

  const getPlatformProfileUrl = (selectedSocials: SocialMedia) => {
    let url = '';

    switch (selectedSocials.platform) {
      case SocialsEnum.TWITTER:
        url = `https://twitter.com/${selectedSocials.people?.username as string}`;
        break;
      case SocialsEnum.REDDIT:
        url = `https://reddit.com/user/${selectedSocials.people?.username as string}`;
        break;
    }

    return url;
  };

  const openSourceAccount = (social: SocialMedia) => {
    const url = getPlatformProfileUrl(social);

    window.open(url, '_blank');
  };

  const styles = useStyles();
  if (isPrivate && !isFriend && !isOwner) {
    return (
      <div style={{marginTop: '27px'}}>
        <Empty
          title="Nothing to see here!"
          subtitle="This account is private. Send them a friend request to see their full profile."
        />
      </div>
    );
  }

  if (socials.length === 0) {
    return (
      <div style={{marginTop: '27px'}}>
        <Empty
          title="Nothing to see here!"
          subtitle="This user hasn't connected to any social media yet."
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <List component="div" className={styles.list}>
        {socials.map(social => {
          return (
            <ListItem
              key={social.id}
              className={styles.item}
              onClick={() => openSourceAccount(social)}>
              <ListItemAvatar>
                <StyledBadge badgeContent={socialsIcon[social.platform]}>
                  <Avatar
                    alt={social.people?.name}
                    src={social.people?.profilePictureURL}
                    className={styles.avatar}
                  />
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText primary={`@${social.people?.username}`} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
