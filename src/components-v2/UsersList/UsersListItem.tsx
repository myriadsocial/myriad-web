import React from 'react';

import Link from 'next/link';

import {Typography} from '@material-ui/core';
import Avatar, {AvatarProps} from '@material-ui/core/Avatar';
import ListItem, {ListItemProps} from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type UsersListItemProps = ListItemProps & {
  icon?: any;
  avatar?: string;
  variant?: AvatarProps['variant'];
  size?: 'tiny' | 'small' | 'medium' | 'large';
  title: string;
  subtitle?: string | React.ReactNode;
  url?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: 0,
    },
    avatar: {
      minWidth: theme.spacing(3.75),
      marginRight: 20,
    },
    icon: {
      minWidth: 24,
      marginRight: 20,
      padding: 6,
    },
    tiny: {
      width: 12,
      height: 12,
    },
    small: {
      width: theme.spacing(3.75),
      height: theme.spacing(3.75),
    },
    medium: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  }),
);

export const UsersListItem: React.FC<UsersListItemProps> = props => {
  const {icon, avatar, variant = 'circular', size = 'small', title, subtitle, url = ''} = props;
  const styles = useStyles();

  const iconSyles = [styles.icon];
  const listProps: any = {};

  return (
    <>
      {url.length === 0 && (
        <ListItem
          button
          component="a"
          className={styles.root}
          ContainerComponent="div"
          {...listProps}
        >
          {avatar && (
            <ListItemAvatar className={styles.avatar}>
              <Avatar alt="Remy Sharp" src={avatar} variant={variant} className={styles[size]} />
            </ListItemAvatar>
          )}

          {icon && !avatar && (
            <ListItemIcon className={iconSyles.join(' ')}>
              <SvgIcon component={icon} />
            </ListItemIcon>
          )}

          <ListItemText
            primary={
              <Typography component="div" variant="h5" color="textPrimary">
                {title}
              </Typography>
            }
            secondary={
              subtitle ? (
                <Typography component="span" variant="subtitle1" color="textPrimary">
                  {subtitle}
                </Typography>
              ) : undefined
            }
          />
        </ListItem>
      )}
      <Link href={url} passHref>
        <ListItem
          button
          component="a"
          className={styles.root}
          ContainerComponent="div"
          {...listProps}
        >
          {avatar && (
            <ListItemAvatar className={styles.avatar}>
              <Avatar alt="Remy Sharp" src={avatar} variant={variant} className={styles[size]} />
            </ListItemAvatar>
          )}

          {icon && !avatar && (
            <ListItemIcon className={iconSyles.join(' ')}>
              <SvgIcon component={icon} />
            </ListItemIcon>
          )}

          <ListItemText
            primary={
              <Typography component="div" variant="h5" color="textPrimary">
                {title}
              </Typography>
            }
            secondary={
              subtitle ? (
                <Typography component="span" variant="subtitle1" color="textPrimary">
                  {subtitle}
                </Typography>
              ) : undefined
            }
          />
        </ListItem>
      </Link>
    </>
  );
};
