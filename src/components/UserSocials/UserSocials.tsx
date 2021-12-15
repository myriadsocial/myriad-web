import React from 'react';

import {List, ListItem, ListItemText, Avatar, ListItemAvatar, Badge} from '@material-ui/core';
import {Theme, withStyles, createStyles} from '@material-ui/core/styles';

import {SocialMedia} from '../../interfaces/social';
import {useStyles} from './UserSocials.styles';

import {Empty} from 'src/components/atoms/Empty';
import {socials as socialsIcon} from 'src/components/atoms/Icons';

type UserSocialsProps = {
  socials: SocialMedia[];
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
  const {socials} = props;

  const styles = useStyles();

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
      <List component="div" className={styles.list}>
        {socials.map(social => {
          return (
            <ListItem key={social.id} className={styles.item}>
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
