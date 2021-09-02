import React from 'react';

import {Typography} from '@material-ui/core';
import Avatar, {AvatarProps} from '@material-ui/core/Avatar';
import ListItem, {ListItemProps} from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type ListItemComponentProps = ListItemProps & {
  icon?: any;
  avatar?: string;
  variant?: AvatarProps['variant'];
  size?: 'small' | 'medium' | 'large';
  title: string;
  subtitle?: string | React.ReactNode;
  action?: string | React.ReactNode;
  active?: boolean;
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
      color: 'transparent',
    },
    active: {
      background: theme.palette.secondary.main,
      borderRadius: 6,
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
    action: {
      right: theme.spacing(1),
    },
  }),
);

export const ListItemComponent: React.FC<ListItemComponentProps> = props => {
  const {icon, avatar, variant = 'circle', size = 'small', title, subtitle, action, active} = props;
  const styles = useStyles();

  const iconSyles = [styles.icon];

  if (active) {
    iconSyles.push(styles.active);
  }

  return (
    <ListItem component="div" className={styles.root} ContainerComponent="div">
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

      {action && (
        <ListItemSecondaryAction className={styles.action}>{action}</ListItemSecondaryAction>
      )}
    </ListItem>
  );
};
