import React from 'react';

import Link from 'next/link';

import {Typography} from '@material-ui/core';
import {AvatarProps} from '@material-ui/core/Avatar';
import ListItem, {ListItemProps} from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {useStyles} from './UsersList.styles';

import {User} from 'src/interfaces/user';

type UsersListItemProps = ListItemProps & {
  user: User;
  icon?: any;
  variant?: AvatarProps['variant'];
  size?: AvatarSize;
  url?: string;
};

export const UsersListItem: React.FC<UsersListItemProps> = props => {
  const {user, icon, variant = 'circular', size = AvatarSize.MEDIUM, url = ''} = props;
  const styles = useStyles();

  const iconSyles = [styles.icon];
  const listProps: any = {};

  return (
    <>
      <Link href={url} passHref>
        <ListItem
          disableGutters
          button
          component="a"
          className={styles.root}
          ContainerComponent="div"
          {...listProps}>
          <ListItemAvatar className={styles.avatar}>
            <Avatar
              alt={user.name}
              name={user.name}
              src={user.profilePictureURL}
              variant={variant}
              size={size}
            />
          </ListItemAvatar>

          {icon && !user.profilePictureURL && (
            <ListItemIcon className={iconSyles.join(' ')}>
              <SvgIcon component={icon} />
            </ListItemIcon>
          )}

          <ListItemText
            primary={
              <Typography component="div" variant="h5" color="textPrimary">
                {user.name}
              </Typography>
            }
            secondary={
              <Typography component="span" variant="caption" color="textSecondary">
                {user.username ? `@${user.username}` : '@anonymous'}
              </Typography>
            }
          />
        </ListItem>
      </Link>
    </>
  );
};
