import React from 'react';

import {Typography} from '@material-ui/core';
import ListItem, {ListItemProps} from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import PostAvatar from 'src/components/atoms/PostHeader/avatar/post-avatar.component';
import {SocialsEnum} from 'src/interfaces/social';
import {PostOrigin} from 'src/interfaces/timeline';

type ListItemComponentProps = ListItemProps & {
  icon?: any;
  avatar?: string;
  title: string;
  subtitle?: string | React.ReactNode;
  action?: string | React.ReactNode;
  active?: boolean;
  url?: string;
  platform?: SocialsEnum;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: 0,
      '& .hidden-button': {
        display: 'none',
      },
      '&:hover .hidden-button': {
        display: 'flex',
      },
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
    active: {
      background: theme.palette.secondary.main,
      borderRadius: 6,
    },
    tiny: {
      width: 12,
      height: 12,
    },
    small: {
      width: theme.spacing(3.75),
      height: theme.spacing(3.75),
      fontSize: theme.typography.h5.fontSize,
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

export const ListItemPeopleComponent: React.FC<ListItemComponentProps> = props => {
  const {icon, avatar, url, platform, title, subtitle, action, active, onClick} = props;
  const styles = useStyles();

  const iconStyles = [styles.icon];
  const listProps: any = {};

  if (url) {
    listProps.button = true;
  }

  if (active) {
    iconStyles.push(styles.active);
  }

  return (
    <ListItem
      key={title}
      component="div"
      className={styles.root}
      ContainerComponent="div"
      onClick={onClick}
      {...listProps}>
      {icon ? (
        <ListItemIcon className={iconStyles.join(' ')}>
          <SvgIcon component={icon} />
        </ListItemIcon>
      ) : (
        <ListItemAvatar className={styles.avatar}>
          <PostAvatar
            name={title}
            origin={platform as PostOrigin}
            avatar={avatar}
            onClick={console.log}
          />
        </ListItemAvatar>
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

      {action && <div className={`${styles.action} hidden-button`}>{action}</div>}
    </ListItem>
  );
};
